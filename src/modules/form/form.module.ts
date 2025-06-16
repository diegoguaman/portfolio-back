import { Module } from '@nestjs/common';
import { SubmitFormController } from './presentation/submit-form.controller';
import { SubmitFormUseCase } from './application/submit-form.usecase';
import { PrismaFormRepository } from './infrastructure/prisma-form.repository';
import { FORM_REPOSITORY_TOKEN } from './domain/form.repository';

@Module({
  controllers: [SubmitFormController],
  providers: [
    SubmitFormUseCase,
    // Inyección de la implementación concreta
    { provide: FORM_REPOSITORY_TOKEN, useClass: PrismaFormRepository },
  ],
})
export class FormModule {}
