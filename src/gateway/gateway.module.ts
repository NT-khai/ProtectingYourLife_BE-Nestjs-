import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service.js';
import { IncidentGatewayController } from './incident-gateway.controller.js';
import { FeedbackGatewayController } from './feedback-gateway.controller.js';
import { UserGatewayController } from './user-gateway.controller.js';
import { UploadController } from './upload.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.COOKIE_ACCESS || 'T@oiLatAnKhai123#$%^',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    IncidentGatewayController,
    FeedbackGatewayController,
    UserGatewayController,
    UploadController,
  ],
  providers: [GatewayService],
  exports: [GatewayService],
})
export class GatewayModule {}
