import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { auth } from '../auth/auth.config'; // Import for API checks

@Injectable()
export class TeamService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getMembers(orgId: string, req: any) {
    const session = await this.authService.getSession(req);

    if (session.session.activeOrganizationId !== orgId) {
      throw new ForbiddenException('Not a member of this organization');
    }

    // Fetch all data in parallel for better performance
    const [organization, members, totalOutlines, owner] = await Promise.all([
      // Get organization details
      this.prisma.organization.findUnique({
        where: { id: orgId },
        select: {
          id: true,
          name: true,
          slug: true,
          createdAt: true,
          
        },
      }),

      // Get members with user info
      this.prisma.member.findMany({
        where: { organizationId: orgId },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),

      // Get count of outlines
      this.prisma.outline.count({
        where: { organizationId: orgId },
      }),

      // Get owner info
      this.prisma.member.findFirst({
        where: {
          organizationId: orgId,
          role: 'owner',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    // Calculate statistics
    const ownerCount = members.filter((m) => m.role === 'owner').length;
    const memberCount = members.filter((m) => m.role === 'member').length;

    return {
      organization: {
        ...organization,
        statistics: {
          totalMembers: members.length,
          owners: ownerCount,
          members: memberCount,
          totalOutlines,
        },
        owner: owner
          ? {
              id: owner.user.id,
              name: owner.user.name,
              email: owner.user.email,
            }
          : null,
      },
      members: members.map((member) => ({
        id: member.id,
        userId: member.userId,
        organizationId: member.organizationId,
        role: member.role,
        createdAt: member.createdAt,
        user: {
          ...member.user,
          isCurrentUser: session.user.id === member.user.id,
        },
      })),
      currentUserRole:
        members.find((m) => m.userId === session.user.id)?.role || null,
    };
  }
  async inviteMember(
    orgId: string,
    email: string,
    role: 'owner' | 'member',
    req: any,
  ) {
    const session = await this.authService.getSession(req);
    if (session.session.activeOrganizationId !== orgId)
      throw new ForbiddenException('Not a member of this organization');

    // Owner-only: Use built-in API (enforces role automatically)
    const permCheck = await auth.api.hasPermission({
      headers: req.headers as any,
      body: {
        organizationId: orgId,
        permission: {
          member: ['create'], // ← this is the correct format
        },
      },
    });
    if (!permCheck)
      throw new ForbiddenException('Only owners can invite members');

    // Delegate to Better-Auth (handles email, expiration, DB insert)
    const result = await auth.api.createInvitation({
      headers: req.headers as any,
      params: { organizationId: orgId },
      body: { email, role },
    });
    if (!result) throw new ForbiddenException(result);
    return result; // { invitation: { id, status, ... } }
  }

  async updateMemberRole(
    memberId: string,
    role: 'owner' | 'member',
    orgId: string,
    req: any,
  ) {
    const session = await this.authService.getSession(req);
    if (session.session.activeOrganizationId !== orgId)
      throw new ForbiddenException('Not a member of this organization');

    const permCheck = await auth.api.hasPermission({
      headers: req.headers as any,
      body: {
        organizationId: orgId,
        permission: {
          member: ['update'], // ← this is the correct format
        },
      },
    });
    if (!permCheck)
      throw new ForbiddenException('Only owners can update roles');

    return this.prisma.member.update({
      where: { id: memberId, organizationId: orgId },
      data: { role },
      include: { user: { select: { id: true, email: true, name: true } } },
    });
  }

  async removeMember(memberId: string, orgId: string, req: any) {
    const session = await this.authService.getSession(req);
    if (session.session.activeOrganizationId !== orgId)
      throw new ForbiddenException('Not a member of this organization');

    const permCheck = await auth.api.hasPermission({
      headers: req.headers as any,
      body: {
        organizationId: orgId,

        permission: {
          member: ['delete'], // ← this is the correct format
        },
      },
    });
    if (!permCheck)
      throw new ForbiddenException('Only owners can remove members');

    // Delegate to Better-Auth (handles cascades)
    const result = await auth.api.removeMember({
      headers: req.headers as any,

      body: {
        memberIdOrEmail: memberId,
        organizationId: orgId,
      },
    });
    if (!result) throw new ForbiddenException(result);
    return { success: true };
  }
}
