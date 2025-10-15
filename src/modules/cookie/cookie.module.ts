import { Module } from '@nestjs/common';
import { CookieConsentController } from './presentation/cookie-consent.controller';
import { SubmitCookieConsentUseCase } from './application/submit-cookie-consent.usecase';
import { PrismaCookieRepository } from './infrastructure/prisma-cookie.repository';
import { COOKIE_REPOSITORY_TOKEN } from './domain/cookie.repository';
import { UpdateCookieConsentUseCase } from './application/update-cookie-consent.usecase';
import { DeleteCookieConsentUseCase } from './application/delete-cookie-consent.usecase';
import { GetCookieConsentsUseCase } from './application/get-cookie-consents.usecase';

@Module({
  controllers: [CookieConsentController],
  providers: [
    SubmitCookieConsentUseCase,
    UpdateCookieConsentUseCase,
    DeleteCookieConsentUseCase,
    GetCookieConsentsUseCase,
    { provide: COOKIE_REPOSITORY_TOKEN, useClass: PrismaCookieRepository },
  ],
  exports: [COOKIE_REPOSITORY_TOKEN],
})
export class CookieModule {}
