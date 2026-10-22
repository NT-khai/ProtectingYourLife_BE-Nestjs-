import { Controller, Post, Req, Res, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';

import { LocalAuthGuard } from './guard/local-auth.guard.js';
import type { Request, Response } from 'express';
import { JwtPayloadDto } from './DTO/jwt-payload.dto.js';
import { RegisterDto } from './DTO/authRegister.dto.js';

interface RequestWithUser extends Request {
  user: JwtPayloadDto;
}

@Controller('/auth')
export class AuthControler {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @Req() req: RequestWithUser,
    @Res({ passthrough: true })
    res: Response,
  ) {
    const token = await this.authService.login(req.user);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 ngày
    });

    return {
      success: true,
      message: 'Đăng nhập thành công',
    };
  }

  @Post('register')
  async register(@Body() taikhoan: RegisterDto) {
    const newUser = await this.authService.register(taikhoan);

    return {
      message: 'Đăng kí thành công',
    };
  }

  @Post('logout')
  logout(
    @Res({ passthrough: true })
    res: Response,
  ) {
    res.clearCookie('access_token');

    return {
      success: true,
      message: 'Đăng xuất thành công',
    };
  }
}
