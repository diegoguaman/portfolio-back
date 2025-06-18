// src/modules/notification/application/send-notification.usecase.ts
import {
  Injectable,
  Inject,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    if (!dto.recipientEmail && !dto.recipientPhone) {
      throw new BadRequestException(
        'Se requiere al menos un canal: email o teléfono WhatsApp',
      );
    }

    try {
      await this.notifier.sendNotification(dto);
    } catch (err) {
      // Si el error ya es un HttpException, propagamos
      if (err instanceof BadRequestException) throw err;
      // Para cualquier fallo del servicio de notificación
      throw new InternalServerErrorException(
        'Error interno al enviar la notificación',
      );
    }
  }
}
