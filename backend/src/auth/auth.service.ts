
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { auth } from './auth.config';

@Injectable()
export class AuthService {
  async getSession(req: Request) {
    // This is the magic — converts Express → Node Headers
    const headers = new Headers();
    Object.entries(req.headers).forEach(([key, value]) => {
      if (value) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else {
          headers.append(key, value);
        }
      }
    });

    const session = await auth.api.getSession({ headers });
    if (!session) throw new UnauthorizedException('Unauthorized');
    return session;
  }
}
