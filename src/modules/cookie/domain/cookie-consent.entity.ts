import { Prisma } from '@prisma/client';

export interface CookieConsentEntity {
  id: number;
  cookieName: string;
  consentGiven: boolean;
  createdAt: Date;
  metadata?: Prisma.JsonValue;
}
