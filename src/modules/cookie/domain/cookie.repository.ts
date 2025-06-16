import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from './cookie-consent.entity';

export interface CookieRepository {
  createConsent(data: CookieConsentDto): Promise<CookieConsentEntity>;
  findByCookieName(name: string): Promise<CookieConsentEntity | null>;
}
