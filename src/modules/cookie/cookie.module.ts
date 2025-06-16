import { Module } from '@nestjs/common';
import { SubmitCookieConsentController } from './presentation/submit-cookie-consent.controller';
import { SubmitCookieConsentUseCase } from './application/submit-cookie-consent.usecase';
import { PrismaCookieRepository } from './infrastructure/prisma-cookie.repository';
import { COOKIE_REPOSITORY_TOKEN } from './domain/constants';

@Module({
  controllers: [SubmitCookieConsentController],
  providers: [
    SubmitCookieConsentUseCase,
    { provide: COOKIE_REPOSITORY_TOKEN, useClass: PrismaCookieRepository },
  ],
})
export class CookieModule {}
