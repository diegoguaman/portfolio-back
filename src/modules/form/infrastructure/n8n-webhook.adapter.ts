import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormSubmissionEntity } from '../domain/form.entity';

/**
 * Adapter para enviar notificaciones a n8n via webhook.
 * n8n se encarga de procesar y enviar las notificaciones (email, web, etc.)
 */
@Injectable()
export class N8nWebhookAdapter {
  private readonly logger = new Logger(N8nWebhookAdapter.name);
  private readonly webhookUrl: string | undefined;
  private readonly isEnabled: boolean;

  constructor(private readonly config: ConfigService) {
    this.webhookUrl = this.config.get<string>('N8N_WEBHOOK_URL');
    this.isEnabled = !!this.webhookUrl;

    if (!this.isEnabled) {
      this.logger.warn(
        'N8N_WEBHOOK_URL not configured, notifications disabled',
      );
    }
  }

  /**
   * Notifica a n8n sobre un nuevo envío de formulario.
   * @param formData - Datos del formulario enviado
   */
  async notifyFormSubmission(formData: FormSubmissionEntity): Promise<void> {
    if (!this.isEnabled || !this.webhookUrl) {
      this.logger.debug('N8n webhook disabled, skipping notification');
      return;
    }

    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: formData.createdAt.toISOString(),
        timestamp: new Date().toISOString(),
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`N8n webhook responded with status ${response.status}`);
      }

      this.logger.log(
        `Form submission notification sent to n8n: id=${formData.id}`,
      );
    } catch (error) {
      // No lanzamos error para no bloquear el flujo principal
      // El formulario ya se guardó, la notificación es secundaria
      this.logger.error(
        `Failed to send notification to n8n: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
