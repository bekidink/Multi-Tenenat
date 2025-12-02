import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ForbiddenException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { OutlineService } from './outline.service';
import { CreateOutlineDto } from './dto/create-outline.dto';
import { UpdateOutlineDto } from './dto/update-outline.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import {
  Session
  
} from '@thallesp/nestjs-better-auth';

@Controller('outlines')
@UseGuards(AuthGuard)
export class OutlineController {
  constructor(private readonly service: OutlineService) {}

  @Post()
  create(@Body() dto: CreateOutlineDto, @Session() user: any) {
    console.log('ss', user);
    return this.service.create(dto, user.session.userId);
  }
  @Get()
  async findAll(@Req() req: any) {
    
    const session = await req.session;

    if (!session?.user) {
      throw new UnauthorizedException('You must be logged in');
    }

    const userId = session.user.id;
    const orgId = session.session.activeOrganizationId;

    if (!orgId) {
      throw new ForbiddenException('No active organization selected');
    }

   
    return this.service.findAll(orgId, userId);
  }
  

  @Get(':id')
  findOne(@Param('id') id: string, @Session() user: any) {
    return this.service.findOne(id, user.id);
  }

  @Patch(':id')
 async update(
    @Param('id') id: string,
    @Body() dto: UpdateOutlineDto,
    @Req() req: any,
  ) {
     const session = await req.session;

     if (!session?.user) {
       throw new UnauthorizedException('You must be logged in');
     }

     const userId = session.user.id;
     const orgId = session.session.activeOrganizationId;

     if (!orgId) {
       throw new ForbiddenException('No active organization selected');
     }
    return this.service.update(id, dto, userId);
  }

  @Delete(':id')
async  remove(@Param('id') id: string, @Req() req: any) {
     const session = await req.session;

     if (!session?.user) {
       throw new UnauthorizedException('You must be logged in');
     }

     const userId = session.user.id;
     const orgId = session.session.activeOrganizationId;

     if (!orgId) {
       throw new ForbiddenException('No active organization selected');
     }
    return this.service.remove(id, userId);
  }
}
