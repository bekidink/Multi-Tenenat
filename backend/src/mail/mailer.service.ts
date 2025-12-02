
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter:nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER!, // bereketdinku876@gmail.com
        pass: process.env.SMTP_PASS!, // srgd jxla tmzq hsot ← THIS IS CORRECT
      },
      tls: {
        rejectUnauthorized: false,
      },
      logger: true,
      debug: true,
    });
  }

  async sendInvitationEmail({
    to,
    organizationName,
    inviterName,
    acceptUrl,
  }: {
    to: string;
    organizationName: string;
    inviterName: string;
    acceptUrl: string;
  }) {
    const subject = `You've been invited to join ${organizationName} on Acme Inc`;

    const html = `
      <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 40px auto; padding: 32px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center;">
        <h1 style="color: #6d28d9; font-size: 28px; margin-bottom: 16px;">You're Invited!</h1>
        <p style="font-size: 18px; color: #374151;">
          <strong>${inviterName}</strong> invited you to join
        </p>
        <h2 style="color: #1f2937; font-size: 24px; margin: 8px 0 24px;">
          ${organizationName}
        </h2>

        <a href="${acceptUrl}" style="
          display: inline-block;
          background: linear-gradient(to right, #a78bfa, #ec4899);
          color: white;
          padding: 16px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          font-size: 18px;
          margin: 32px 0;
        ">
          Accept Invitation
        </a>

        <p style="color: #6b7280; font-size: 14px;">
          Or copy this link:<br>
          <code style="background: #f3f4f6; padding: 8px 12px; border-radius: 8px; font-size: 13px; color: #4b5563;">
            ${acceptUrl}
          </code>
        </p>

        <hr style="border: 1px dashed #e5e7eb; margin: 32px 0;">
        <small style="color: #9ca3af;">This invitation expires in 7 days</small>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from: `"Acme Inc" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });
      console.log(`INVITATION EMAIL SENT TO ${to}`);
    } catch (error: any) {
      console.error('EMAIL FAILED BUT INVITE STILL CREATED:', error.message);
      // Don't fail the invite if email fails
    }
  }
}
