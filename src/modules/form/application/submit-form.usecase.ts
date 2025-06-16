import { Inject, Injectable } from '@nestjs/common';
import { FormRepository } from '../domain/form.repository';
import { SubmitFormDto } from '../../form/presentation/dtos';
import { FormSubmissionEntity } from '../domain/form.entity';

@Injectable()
export class SubmitFormUseCase {
  constructor(
    @Inject('FormRepository') private readonly formRepo: FormRepository,
  ) {}

  async execute(dto: SubmitFormDto): Promise<FormSubmissionEntity> {
    const record = await this.formRepo.create(dto);
    // aquí podrías disparar notificaciones
    return record;
  }
}
