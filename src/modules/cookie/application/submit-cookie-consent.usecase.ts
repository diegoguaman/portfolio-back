import { Injectable, Inject } from '@nestjs/common';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import { COOKIE_REPOSITORY_TOKEN } from './../domain/constants';

@Injectable()
export class SubmitCookieConsentUseCase {
  constructor(
    @Inject(COOKIE_REPOSITORY_TOKEN)
    private readonly cookieRepo: CookieRepository,
  ) {}

  async execute(dto: CookieConsentDto): Promise<CookieConsentEntity> {
    const existing = await this.cookieRepo.findByCookieName(dto.cookieName);
    if (existing) {
      return existing; // ya existe consentimiento previo :contentReference[oaicite:9]{index=9}
    }
    const record = await this.cookieRepo.createConsent(dto);
    return record;
  }
}
