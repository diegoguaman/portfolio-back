// src/modules/notification/infrastructure/whatsapp.adapter.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';
import { NotificationServicePort } from '../domain/notification.service.port';
import { NotificationDto } from '../presentation/dtos/notification.dto';

@Injectable()
export class WhatsAppAdapter implements NotificationServicePort {
  private readonly logger = new Logger(WhatsAppAdapter.name);
  private readonly client: Twilio;
  private readonly from: string;
  private readonly templateSid: string;

  constructor(private readonly config: ConfigService) {
    // Validación y tipado seguro: nunca undefined
    const sid = this.config.getOrThrow<string>('TWILIO_ACCOUNT_SID');
    const token = this.config.getOrThrow<string>('TWILIO_AUTH_TOKEN');
    this.from = this.config.getOrThrow<string>('TWILIO_WHATSAPP_FROM');
    this.templateSid = this.config.getOrThrow<string>(
      'TWILIO_WHATSAPP_TEMPLATE_SID',
    );

    // Instancia tipada correctamente
    this.client = new Twilio(sid, token);
  }

  async sendNotification(dto: NotificationDto): Promise<void> {
    if (!dto.recipientPhone) return;

    const contentVariables = JSON.stringify({
      '1': dto.templateVariables?.date ?? '',
      '2': dto.templateVariables?.time ?? '',
    });

    // La llamada create() infiere MessageInstance correctamente
    const message = await this.client.messages.create({
      from: this.from, // string
      to: `whatsapp:${dto.recipientPhone}`, // string
      contentSid: this.templateSid, // string
      contentVariables, // string
    });

    // message.sid está ahora tipado como string
    this.logger.log(
      `WhatsApp template sent; sid=${message.sid} to=${dto.recipientPhone}`,
    );
  }
}
