import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from './cookie-consent.entity';

export interface CookieRepository {
  createConsent(data: CookieConsentDto): Promise<CookieConsentEntity>;
  findByUserAndName(
    anonymousId: string,
    name: string,
  ): Promise<CookieConsentEntity | null>;
  findAllByUser(
    anonymousId: string,
    options?: { skip: number; take: number },
  ): Promise<CookieConsentEntity[]>;
  updateConsent(
    anonymousId: string,
    name: string,
    data: Partial<CookieConsentDto>,
  ): Promise<CookieConsentEntity>;
  deleteConsent(anonymousId: string, name: string): Promise<void>;
}
export const COOKIE_REPOSITORY_TOKEN = Symbol('CookieRepository');
