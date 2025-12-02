import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOutlineDto } from './dto/create-outline.dto';
import { UpdateOutlineDto } from './dto/update-outline.dto';

@Injectable()
export class OutlineService {
  constructor(private prisma: PrismaService) {}

  private async verifyMember(userId: string, orgId: string) {
    const member = await this.prisma.member.findUnique({
      where: { userId_organizationId: { userId, organizationId: orgId } },
    });
    if (!member)
      throw new ForbiddenException('Not a member of this organization');
    return member;
  }

  async create(dto: CreateOutlineDto, userId: string) {
    await this.verifyMember(userId, dto.organizationId);
    return this.prisma.outline.create({ data: dto });
  }

  async findAll(orgId: string, userId: string) {
    await this.verifyMember(userId, orgId);
    return this.prisma.outline.findMany({ where: { organizationId: orgId } });
  }

  async findOne(id: string, userId: string) {
    const outline = await this.prisma.outline.findUnique({ where: { id } });
    if (!outline) throw new NotFoundException();
    await this.verifyMember(userId, outline.organizationId);
    return outline;
  }

  async update(id: string, dto: UpdateOutlineDto, userId: string) {
    const outline = await this.prisma.outline.findUnique({ where: { id } });
    if (!outline) throw new NotFoundException();
    await this.verifyMember(userId, outline.organizationId);
    return this.prisma.outline.update({ where: { id }, data: dto });
  }

  async remove(id: string, userId: string) {
    const outline = await this.prisma.outline.findUnique({ where: { id } });
    if (!outline) throw new NotFoundException();
    await this.verifyMember(userId, outline.organizationId);
    return this.prisma.outline.delete({ where: { id } });
  }
}
