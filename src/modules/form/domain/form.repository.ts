import { SubmitFormDto } from '../presentation/dtos/submit-form.dto';
import { FORM_REPOSITORY } from './constants';
import { FormSubmissionEntity } from './form.entity';

export interface FormRepository {
  create(data: SubmitFormDto): Promise<FormSubmissionEntity>;
}

export const FORM_REPOSITORY_TOKEN = FORM_REPOSITORY;
