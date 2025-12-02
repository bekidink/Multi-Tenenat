
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../prisma/generated/client/client';
import { adapter } from './pg-pool'; // ← shared instance

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect()
      .then(() => console.log('✅ Prisma connected via shared PG adapter'))
      .catch((err) => {
        console.error('❌ Prisma connection failed:', err);
        process.exit(1);
      });
  }
}
