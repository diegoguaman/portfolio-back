import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  FormRepository,
  FORM_REPOSITORY_TOKEN,
} from '../domain/form.repository';
import { SubmitFormDto } from '../../form/presentation/dtos';
import { FormSubmissionEntity } from '../domain/form.entity';

@Injectable()
export class SubmitFormUseCase {
  constructor(
    @Inject(FORM_REPOSITORY_TOKEN) private readonly formRepo: FormRepository,
  ) {}

  async execute(dto: SubmitFormDto): Promise<FormSubmissionEntity> {
    // Validación de DTO
    if (!dto.name || dto.name.trim() === '') {
      throw new BadRequestException('name is required');
    }
    if (!dto.email || !this.isValidEmail(dto.email)) {
      throw new BadRequestException('valid email is required');
    }
    if (!dto.message || dto.message.length > 500) {
      throw new BadRequestException('message must be 1-500 characters');
    }
    try {
      const record = await this.formRepo.create(dto);
      // aquí podrías disparar notificaciones
      // Dispara evento para n8n (webhook)
      if (!record) {
        throw new InternalServerErrorException(
          'Error al procesar el envío del formulario',
        );
      }
      return record;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al procesar el envío del formulario',
      );
    }
  }
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
