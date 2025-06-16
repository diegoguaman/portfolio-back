import { JsonValue } from 'generated/prisma/runtime/library';

export interface CookieConsentEntity {
  id: number;
  cookieName: string;
  consentGiven: boolean;
  createdAt: Date;
  metadata?: JsonValue;
}
