import { AuthService } from '../auth.service.js';
import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { JwtPayloadDto } from '../DTO/jwt-payload.dto.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'matkhau',
    });
  }

  async validate(email: string, matkhau: string): Promise<JwtPayloadDto> {
    const user = await this.authService.validateUser(email, matkhau);

    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      ngaytao: user.ngaytao!,
      role: user.role!,
    };
  }
}
