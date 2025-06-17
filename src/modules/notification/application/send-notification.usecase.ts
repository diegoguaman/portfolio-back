// src/modules/notification/application/send-notification.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { NotificationServicePort } from '../domain/notification.service.port';
import { NotificationDto } from '../presentation/dtos/notification.dto';
import { NOTIFICATION_SERVICE_TOKEN } from '../domain/constants';

@Injectable()
export class SendNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_SERVICE_TOKEN)
    private readonly notifier: NotificationServicePort,
  ) {}

  async execute(dto: NotificationDto): Promise<void> {
    // Aquí podrías enriquecer el payload, añadir plantillas, logs, etc.
    await this.notifier.sendNotification(dto);
  }
}
