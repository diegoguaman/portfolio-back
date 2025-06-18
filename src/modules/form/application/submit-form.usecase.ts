import {
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
    const record = await this.formRepo.create(dto);
    // aquí podrías disparar notificaciones
    if (record) {
      return record;
    }
    throw new InternalServerErrorException(
      'Error al procesar el envío del formulario',
    );
  }
}
