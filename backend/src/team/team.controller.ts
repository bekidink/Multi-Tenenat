import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get() // READ: List members
  async getMembers( @Req() req: any) {
    const session = await req.session;
    
        if (!session?.user) {
          throw new UnauthorizedException('You must be logged in');
        }
    
        
        const orgId = session.session.activeOrganizationId;
    
        if (!orgId) {
          throw new ForbiddenException('No active organization selected');
        }
    return this.teamService.getMembers(orgId, req);
  }

  @Post(':orgId/invite') // CREATE: Invite (returns invitation)
  async invite(
    @Param('orgId') orgId: string,
    @Body() body: { email: string; role: 'owner' | 'member' },
    @Req() req: any,
  ) {
    return this.teamService.inviteMember(orgId, body.email, body.role, req);
  }

  @Patch(':orgId/members/:memberId/role') // UPDATE: Change role
  async updateRole(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: 'owner' | 'member' },
    @Req() req: any,
  ) {
    return this.teamService.updateMemberRole(memberId, body.role, orgId, req);
  }

  @Delete(':orgId/members/:memberId') // DELETE: Remove
  async remove(
    @Param('orgId') orgId: string,
    @Param('memberId') memberId: string,
    @Req() req: any,
  ) {
    return this.teamService.removeMember(memberId, orgId, req);
  }
}
