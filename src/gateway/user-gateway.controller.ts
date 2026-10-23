import {
  Controller,
  Get,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { GatewayService } from './gateway.service.js';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard.js';
import type { Request } from 'express';
import { JwtPayloadDto } from '../auth/DTO/jwt-payload.dto.js';

interface RequestWithUser extends Request {
  user: JwtPayloadDto;
}

@Controller('api/users')
export class UserGatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  async getAllUsers() {
    return this.gatewayService.getAllUsers();
  }
  private extractToken(req: RequestWithUser): string | undefined {
    const bearer = req.headers.authorization?.replace(/^Bearer\s+/i, '');
    return (req.cookies?.access_token as string | undefined) ?? bearer;
  }
  @Get('profile/me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@Req() req: RequestWithUser) {
    console.log('Extracted Token:', this.extractToken(req)); // Debugging line
    return this.gatewayService.getUserProfile(
      req.user.id,
      this.extractToken(req),
    );
  }

  @Put('profile/me')
  @UseGuards(JwtAuthGuard)
  async updateMyProfile(@Req() req: RequestWithUser, @Body() body: any) {
    return this.gatewayService.updateUserProfile(
      req.user.id,
      body,
      this.extractToken(req),
    );
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.getUserById(id);
  }

  @Patch(':id/role')
  async updateUserRole(
    @Param('id', ParseIntPipe) id: number,
    @Body('role') role: string,
  ) {
    return this.gatewayService.updateUserRole(id, role);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.deleteUser(id);
  }
}
