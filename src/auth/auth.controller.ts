import {
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LocalAuthGuard } from './guard/local-auth.guard.js';
import { JwtAuthGuard } from './guard/jwt-auth.guard.js';
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
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: 'Đăng nhập thành công',
      token,
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() taikhoan: RegisterDto) {
    await this.authService.register(taikhoan);

    return {
      success: true,
      message: 'Đăng ký thành công',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: RequestWithUser) {
    const user = await this.authService.getUserById(req.user.id);
    return {
      success: true,
      user: {
        id: user.id,
        hovaten: user.hovaten,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        ngaytao: user.ngaytao,
      },
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
