import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CookieRepository,
  COOKIE_REPOSITORY_TOKEN,
} from '../domain/cookie.repository';

/**
 * Use case para delete (revocación). Cumple GDPR al permitir eliminación.
 */
@Injectable()
export class DeleteCookieConsentUseCase {
  constructor(
    @Inject(COOKIE_REPOSITORY_TOKEN)
    private readonly cookieRepo: CookieRepository,
  ) {}

  async execute(anonymousId: string, cookieName: string): Promise<void> {
    const existing = await this.cookieRepo.findByAnonAndName(
      anonymousId,
      cookieName,
    );
    if (!existing)
      throw new NotFoundException(`Consent not found for ${cookieName}`);
    await this.cookieRepo.deleteConsent(anonymousId, cookieName);
  }
}
