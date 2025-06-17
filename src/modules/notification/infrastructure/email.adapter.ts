import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationServicePort } from '../domain/notification.service.port';
import { NotificationDto } from '../presentation/dtos/notification.dto';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailAdapter implements NotificationServicePort {
  private readonly logger = new Logger(EmailAdapter.name);

  constructor(private readonly config: ConfigService) {
    // Inicializa la API key de SendGrid
    const apiKey = this.config.get<string>('SENDGRID_API_KEY');
    if (!apiKey) {
      // Fallamos rápido si no está configurada
      throw new Error('Missing SENDGRID_API_KEY in environment');
    }
    SendGrid.setApiKey(apiKey);
  }

  async sendNotification(dto: NotificationDto): Promise<void> {
    const msg = {
      to: dto.recipientEmail,
      from: this.config.get<string>('SMTP_FROM') ?? 'no-reply@tu-dominio.com',
      subject: dto.subject,
      text: dto.message,
      // html: '<strong>...</strong>' si quieres HTML
    };

    // Envía usando la Web API de SendGrid
    await SendGrid.send(msg);
    this.logger.log(`SendGrid email queued to ${dto.recipientEmail}`);
  }
}
