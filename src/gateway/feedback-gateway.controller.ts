import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { GatewayService } from './gateway.service.js';

@Controller('api/feedback')
export class FeedbackGatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Get()
  async getFeedbacks() {
    return this.gatewayService.getFeedbacks();
  }

  @Post()
  async createFeedback(@Body() body: any) {
    return this.gatewayService.createFeedback(body);
  }

  @Delete(':id')
  async deleteFeedback(@Param('id', ParseIntPipe) id: number) {
    return this.gatewayService.deleteFeedback(id);
  }
}
