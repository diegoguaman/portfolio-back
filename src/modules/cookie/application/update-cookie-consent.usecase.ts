import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CookieRepository,
  COOKIE_REPOSITORY_TOKEN,
} from '../domain/cookie.repository';
import { UpdateCookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

/**
 * Use case para update. SOLID:O - Extensible para más fields sin cambiar clase.
 */
@Injectable()
export class UpdateCookieConsentUseCase {
  constructor(
    @Inject(COOKIE_REPOSITORY_TOKEN)
    private readonly cookieRepo: CookieRepository,
  ) {}

  async execute(
    anonymousId: string,
    cookieName: string,
    dto: UpdateCookieConsentDto,
  ): Promise<CookieConsentEntity> {
    const existing = await this.cookieRepo.findByAnonAndName(
      anonymousId,
      cookieName,
    );
    if (!existing)
      throw new NotFoundException(`Consent not found for ${cookieName}`);
    return this.cookieRepo.updateConsent(anonymousId, cookieName, dto);
  }
}
