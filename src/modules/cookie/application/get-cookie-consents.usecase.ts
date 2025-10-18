import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import {
  CookieRepository,
  COOKIE_REPOSITORY_TOKEN,
} from '../domain/cookie.repository';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';

/**
 * Use case para obtener consents. SOLID:S - Solo lectura.
 */
@Injectable()
export class GetCookieConsentsUseCase {
  constructor(
    @Inject(COOKIE_REPOSITORY_TOKEN)
    private readonly cookieRepo: CookieRepository,
  ) {}

  async execute(
    anonymousId: string,
    options?: { skip: number; take: number },
  ): Promise<CookieConsentEntity[]> {
    const consents = await this.cookieRepo.findAllByAnon(anonymousId, options);
    if (!consents.length)
      throw new NotFoundException(`No consents found for ${anonymousId}`);
    return consents;
  }
}
