import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from './cookie-consent.entity';

export interface CookieRepository {
  createConsent(
    this: void,
    data: CookieConsentDto,
  ): Promise<CookieConsentEntity>;
  findByAnonAndName(
    this: void,
    anonymousId: string,
    name: string,
  ): Promise<CookieConsentEntity | null>;
  findAllByAnon(
    this: void,
    anonymousId: string,
    options?: { skip: number; take: number },
  ): Promise<CookieConsentEntity[]>;
  updateConsent(
    this: void,
    anonymousId: string,
    name: string,
    data: Partial<CookieConsentDto>,
  ): Promise<CookieConsentEntity>;
  deleteConsent(this: void, anonymousId: string, name: string): Promise<void>;
}
export const COOKIE_REPOSITORY_TOKEN = Symbol('CookieRepository');
