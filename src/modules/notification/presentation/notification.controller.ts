import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SendNotificationUseCase } from '../application/send-notification.usecase';
import { NotificationDto } from './dtos/notification.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly sendNotification: SendNotificationUseCase) {}

  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Enviar notificación por email/WhatsApp' })
  @ApiResponse({ status: 202, description: 'Notificación encolada para envío' })
  async notify(@Body() dto: NotificationDto) {
    await this.sendNotification.execute(dto);
    return { status: 'queued' };
  }
}
