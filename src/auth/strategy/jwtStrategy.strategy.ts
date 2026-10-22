import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { JwtPayloadDto } from '../DTO/jwt-payload.dto.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies?.access_token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.COOKIE_ACCESS!,
    });
  }

  async validate(payload: JwtPayloadDto): Promise<JwtPayloadDto> {
    return payload;
  }
}
