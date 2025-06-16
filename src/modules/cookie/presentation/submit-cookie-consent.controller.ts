import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmitCookieConsentUseCase } from '../application/submit-cookie-consent.usecase';
import { CookieConsentDto } from './dtos/cookie-consent.dto';

@Controller('cookie-consent')
export class SubmitCookieConsentController {
  constructor(private readonly useCase: SubmitCookieConsentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async submit(@Body() dto: CookieConsentDto) {
    const result = await this.useCase.execute(dto);
    return {
      id: result.id,
      consentGiven: result.consentGiven,
      createdAt: result.createdAt,
    };
  }
}
