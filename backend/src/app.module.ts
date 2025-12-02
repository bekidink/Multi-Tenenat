import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { OutlineModule } from './outline/outline.module';
import { PrismaModule } from './prisma/prisma.module';
import { TeamModule } from './team/team.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    OutlineModule,
    TeamModule,
    MailModule,
    PrismaModule,
  ],
})
export class AppModule {}
