import { Prisma } from '@prisma/client';

export interface CookieConsentEntity {
  id: number;
  anonymousId: string | null;
  cookieName: string;
  consentGiven: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Prisma.JsonValue;
}
