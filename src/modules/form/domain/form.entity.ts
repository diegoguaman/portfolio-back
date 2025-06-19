import { Prisma } from '@prisma/client';

export interface FormSubmissionEntity {
  id: number;
  name: string;
  email: string;
  message: string;
  cookies: Prisma.JsonValue;
  createdAt: Date;
}
