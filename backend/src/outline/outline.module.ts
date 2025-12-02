import { Module } from '@nestjs/common';
import { OutlineController } from './outline.controller';
import { OutlineService } from './outline.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OutlineController],
  providers: [OutlineService],
})
export class OutlineModule {}
