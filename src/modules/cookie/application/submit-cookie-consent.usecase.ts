import {
  Injectable,
  Inject,
  ConflictException,
  Logger,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CookieRepository } from '../domain/cookie.repository';
import { CookieConsentDto } from '../presentation/dtos/cookie-consent.dto';
import { CookieConsentEntity } from '../domain/cookie-consent.entity';
import { COOKIE_REPOSITORY_TOKEN } from './../domain/cookie.repository';

@Injectable()
export class SubmitCookieConsentUseCase {
  private readonly logger = new Logger(SubmitCookieConsentUseCase.name);
  constructor(
    @Inject(COOKIE_REPOSITORY_TOKEN)
    private readonly cookieRepo: CookieRepository,
  ) {}

  async execute(dto: CookieConsentDto): Promise<CookieConsentEntity> {
    if (!dto.anonymousId || dto.anonymousId.trim() === '')
      throw new BadRequestException('anonymousId is required');
    try {
      const existing = await this.cookieRepo.findByAnonAndName(
        dto.anonymousId,
        dto.cookieName,
      );
      if (existing) {
        throw new ConflictException(
          `Consent for "${dto.cookieName}" already exists`,
        );
      }
      const result = await this.cookieRepo.createConsent(dto);
      this.logger.log(
        `Consent created for user ${dto.anonymousId}, cookie: ${dto.cookieName}`,
      );
      return result;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      // Para cualquier otro error, devolvemos un 500
      throw new InternalServerErrorException('Failed to submit cookie consent');
    }
  }
}
