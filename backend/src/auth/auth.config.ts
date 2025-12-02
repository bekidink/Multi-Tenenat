
import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access'; // ← Key import (not on betterAuth)
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../prisma/generated/client/client';

import { adapter } from 'src/prisma/pg-pool';
import { defaultStatements } from 'better-auth/plugins/organization/access';
import { MailerService } from 'src/mail/mailer.service';
// Prisma setup (unchanged)
const prisma = new PrismaClient({ adapter });
const authLogger = {
  info: (message: string, meta?: any) => {
    console.log(`[BetterAuth] ${message}`, meta || '');
  },
  error: (message: string, meta?: any) => {
    console.error(`[BetterAuth] ERROR: ${message}`, meta || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[BetterAuth] WARN: ${message}`, meta || '');
  },
  debug: (message: string, meta?: any) => {
    console.debug(`[BetterAuth] DEBUG: ${message}`, meta || '');
  },
};
// Step 1: Define statement (resources + actions) – as const for TS inference
const statement = {
  organization: ['create', 'read','update', 'delete'], // Org-level actions
  member: ['create', 'update', 'delete', 'read'], // Member actions (invite/remove/update role/list)
} as const;

// Step 2: Create access control instance
export const ac = createAccessControl({...defaultStatements, ...statement});

// Step 3: Define roles using ac.newRole (owner/member as required)
export const owner = ac.newRole({
  organization: ['create', 'update', 'delete','read'], // Owner can manage org
  member: ['create', 'update', 'delete', 'read'], // Owner can invite/remove/update/list members
});

export const member = ac.newRole({
  organization: [], // Members can't manage org
  member: ['read'], // Members can only list members
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  trustedOrigins: [
    'http://localhost:5001',
    'http://localhost:7000',
    'https://acme-backend-jl77.onrender.com',
    'https://acme-takehome.onrender.com',
  ],
  emailAndPassword: { enabled: true },
  session: { expiresIn: 60 * 60 * 24 * 7 },
  debug: process.env.NODE_ENV === 'development',

  // Custom logger (if supported in your version)
  Logger: authLogger,
  databaseHooks: {
    session: {
      create: {
        before: async (sessionData) => {
          // IMPLEMENT getActiveOrganization (user's first owner org)
          const userOrgs = await prisma.member.findFirst({
            where: { userId: sessionData.userId, role: 'owner' },
            include: { organization: true },
          });
          if (userOrgs?.organizationId) {
            // FIXED: Return { data: modified } — type-safe
            return {
              data: {
                ...sessionData,
                activeOrganizationId: userOrgs.organizationId,
              },
            };
          }
          return true; // Allow without change
        },
      },
    },
  },
  plugins: [
    organization({
      creatorRole: 'owner', // Owner gets full control
      initialRole: 'member', // New invites get member
      invitationExpiresIn: 7 * 24 * 60 * 60, // 7 days
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        const mailer = new MailerService(); // or inject via container if you prefer

        const acceptUrl = `${process.env.FRONT_END_URL!}/join-organization?token=${invitation.id}`;

        await mailer.sendInvitationEmail({
          to: email,
          organizationName: organization.name,
          inviterName: inviter.user.name || inviter.user.email,
          acceptUrl,
        });
        // console.log(`Invite ${email} to ${organization.name} by ${acceptUrl}`);
      },
      organizationHooks: {
        afterCreateOrganization: async ({ organization, user }) => {
          await prisma.session.updateMany({
            where: { userId: user.id },
            data: { activeOrganizationId: organization.id },
          });
        },
      },
    }),
  ],
});
