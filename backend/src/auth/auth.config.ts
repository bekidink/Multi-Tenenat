import { betterAuth } from 'better-auth';
import { organization } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { PrismaClient } from '../../prisma/generated/client/client';
import { adapter } from 'src/prisma/pg-pool';
import { defaultStatements } from 'better-auth/plugins/organization/access';
import { MailerService } from 'src/mail/mailer.service';

// Prisma setup
const prisma = new PrismaClient({ adapter });

// Access Control
const statement = {
  organization: ['create', 'read', 'update', 'delete'],
  member: ['create', 'update', 'delete', 'read'],
} as const;

export const ac = createAccessControl({ ...defaultStatements, ...statement });

export const owner = ac.newRole({
  organization: ['create', 'update', 'delete', 'read'],
  member: ['create', 'update', 'delete', 'read'],
});

export const member = ac.newRole({
  organization: [],
  member: ['read'],
});

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  trustedOrigins: ['*'],
  emailAndPassword: { enabled: true },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookie: {
      httpOnly: true,
      path: '/',
      domain: undefined, // leave undefined for dev and IP
      secure: true, // true for HTTPS
    },
    insecureDevMode: false,
  },

  advanced: {
    ipAddress: {
      ipAddressHeaders: ['x-client-ip', 'x-forwarded-for'],
      disableIpTracking: false,
    },
    useSecureCookies:true,
    defaultCookieAttributes: {
      httpOnly: true,
      secure: true,
      sameSite:  'none',
      path: '/',
    },
    cookies: {
      session_token: {
        name: 'better-auth.session_token',
        attributes: {},
      },
    },
    crossSubDomainCookies: {
      enabled: false,
    },
  },

  debug: true,

  Logger: {
    info: (msg, meta) => console.log('[BetterAuth]', msg, meta || ''),
    error: (msg, meta) => console.error('[BetterAuth] ERROR', msg, meta || ''),
    warn: (msg, meta) => console.warn('[BetterAuth] WARN', msg, meta || ''),
    debug: (msg, meta) => console.debug('[BetterAuth] DEBUG', msg, meta || ''),
  },

  databaseHooks: {
    session: {
      create: {
        before: async (sessionData) => {
          const userOrgs = await prisma.member.findFirst({
            where: { userId: sessionData.userId, role: 'owner' },
            include: { organization: true },
          });
          if (userOrgs?.organizationId) {
            return {
              data: {
                ...sessionData,
                activeOrganizationId: userOrgs.organizationId,
              },
            };
          }
          return true;
        },
      },
    },
  },

  plugins: [
    organization({
      creatorRole: 'owner',
      initialRole: 'member',
      invitationExpiresIn: 7 * 24 * 60 * 60,
      sendInvitationEmail: async ({
        email,
        organization,
        inviter,
        invitation,
      }) => {
        const mailer = new MailerService();
        const acceptUrl = `${process.env.FRONTEND_URL}/join-organization?token=${invitation.id}`;
        await mailer.sendInvitationEmail({
          to: email,
          organizationName: organization.name,
          inviterName: inviter.user.name || inviter.user.email,
          acceptUrl,
        });
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

console.log('🔵 BetterAuth Cookie Settings:', auth.options.session.cookie);
console.log(
  '🔥 FINAL COOKIE SETTINGS:',
  auth.options.advanced,
);
