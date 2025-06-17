// src/modules/notification/notification.module.ts
import { Module } from '@nestjs/common';
import { NotificationController } from './presentation/notification.controller';
import { SendNotificationUseCase } from './application/send-notification.usecase';
import { EmailAdapter } from './infrastructure/email.adapter';
import { WhatsAppAdapter } from './infrastructure/whatsapp.adapter';
import { NOTIFICATION_SERVICE_TOKEN } from './domain/constants';

@Module({
  controllers: [NotificationController],
  providers: [
    SendNotificationUseCase,
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: EmailAdapter },
    { provide: NOTIFICATION_SERVICE_TOKEN, useClass: WhatsAppAdapter },
    // Si guardas logs:
    // PrismaNotificationRepository
  ],
})
export class NotificationModule {}
