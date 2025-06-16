import { JsonValue } from 'generated/prisma/runtime/library';

export interface FormSubmissionEntity {
  id: number;
  name: string;
  email: string;
  message: string;
  cookies: JsonValue;
  createdAt: Date;
}
