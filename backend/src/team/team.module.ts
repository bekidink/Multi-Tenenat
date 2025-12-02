import { Module } from '@nestjs/common';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [TeamController],
  providers: [TeamService, AuthService],
})
export class TeamModule {}
