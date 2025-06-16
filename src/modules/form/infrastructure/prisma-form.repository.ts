import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { FormRepository } from '../domain/form.repository';
import { SubmitFormDto } from './../presentation/dtos/submit-form.dto';
import { FormSubmissionEntity } from '../domain/form.entity';
@Injectable()
export class PrismaFormRepository implements FormRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SubmitFormDto): Promise<FormSubmissionEntity> {
    return this.prisma.formSubmission.create({ data });
  }
}
