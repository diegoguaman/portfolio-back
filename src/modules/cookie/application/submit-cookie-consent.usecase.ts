import {
  Injectable,
  Inject,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const existing = await this.cookieRepo.findByCookieName(dto.cookieName);
      if (existing) {
        throw new ConflictException(
          `Consent for "${dto.cookieName}" already exists`,
        );
      }
      return await this.cookieRepo.createConsent(dto);
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      // Para cualquier otro error, devolvemos un 500
      throw new InternalServerErrorException('Failed to submit cookie consent');
    }
  }
}
