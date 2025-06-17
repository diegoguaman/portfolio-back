import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SendNotificationUseCase } from '../application/send-notification.usecase';
import { NotificationDto } from './dtos/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly sendNotification: SendNotificationUseCase) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  async notify(@Body() dto: NotificationDto) {
    await this.sendNotification.execute(dto);
    return { status: 'queued' };
  }
}
