import {
  Controller,
  Get,
  Post,
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
import { JwtService } from '@nestjs/jwt';

interface RequestWithUser extends Request {
  user: JwtPayloadDto;
}

@Controller('api/incidents')
export class IncidentGatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  async getAllIncidents() {
    return this.gatewayService.getIncidents();
  }

  @Get('stats')
  async getIncidentStats() {
    return this.gatewayService.getIncidentStats();
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  async getMyIncidents(@Req() req: RequestWithUser) {
    return this.gatewayService.getIncidentsByUserId(req.user.id);
  }

  @Get(':id')
  async getIncidentById(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.getIncidentById(id);
  }

  @Post()
  async createIncident(@Body() body: any, @Req() req: Request) {
    // Attempt to extract user id from auth token if available
    let userId = body.userId;
    if (!userId) {
      const token =
        req.cookies?.access_token ||
        (req.headers.authorization?.startsWith('Bearer ')
          ? req.headers.authorization.split(' ')[1]
          : null);

      if (token) {
        try {
          const payload = this.jwtService.verify(token, {
            secret: process.env.COOKIE_ACCESS || 'T@oiLatAnKhai123#$%^',
          });
          if (payload?.id) {
            userId = payload.id;
          }
        } catch {
          // Token invalid or expired, continue without userId
        }
      }
    }

    const payload = {
      ...body,
      userId: userId ? Number(userId) : undefined,
    };

    return this.gatewayService.createIncident(payload);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: string,
  ) {
    return this.gatewayService.updateIncidentStatus(id, status);
  }

  @Patch(':id/approve')
  async approveIncident(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.approveIncident(id);
  }

  @Delete(':id')
  async deleteIncident(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.deleteIncident(id);
  }
}
