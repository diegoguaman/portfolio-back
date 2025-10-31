import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  FormRepository,
  FORM_REPOSITORY_TOKEN,
} from '../domain/form.repository';
import { SubmitFormDto } from '../../form/presentation/dtos';
import { FormSubmissionEntity } from '../domain/form.entity';
import { N8nWebhookAdapter } from '../infrastructure/n8n-webhook.adapter';

/**
 * Use case para procesar el envío de formularios de contacto.
 * Guarda el formulario y dispara notificaciones via webhook a n8n.
 */
@Injectable()
export class SubmitFormUseCase {
  private readonly logger = new Logger(SubmitFormUseCase.name);

  constructor(
    @Inject(FORM_REPOSITORY_TOKEN) private readonly formRepo: FormRepository,
    private readonly n8nWebhook: N8nWebhookAdapter,
  ) {}

  /**
   * Ejecuta el caso de uso de envío de formulario.
   * @param dto - Datos del formulario validados
   * @returns La entidad del formulario creada
   * @throws InternalServerErrorException si falla el guardado
   */
  async execute(dto: SubmitFormDto): Promise<FormSubmissionEntity> {
    try {
      const record = await this.formRepo.create(dto);
      this.logger.log(
        `Form submission created: id=${record.id}, email=${dto.email}`,
      );
      // Notificar a n8n de forma asíncrona (no bloqueante)
      void this.n8nWebhook.notifyFormSubmission(record);
      return record;
    } catch (error) {
      this.logger.error('Failed to create form submission', error);
      throw new InternalServerErrorException(
        'Error al procesar el envío del formulario',
      );
    }
  }
}
