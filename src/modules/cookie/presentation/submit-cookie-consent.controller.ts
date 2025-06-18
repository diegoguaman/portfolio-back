import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmitCookieConsentUseCase } from '../application/submit-cookie-consent.usecase';
import { CookieConsentDto } from './dtos/cookie-consent.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Cookies')
@Controller('cookie-consent')
export class SubmitCookieConsentController {
  constructor(private readonly useCase: SubmitCookieConsentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Guardar preferencia de cookies del usuario' })
  @ApiResponse({ status: 201, description: 'Consentimiento registrado' })
  @ApiResponse({
    status: 409,
    description: 'Ya existe consentimiento para esta cookie',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno al procesar el consentimiento',
  })
  async submit(@Body() dto: CookieConsentDto) {
    const result = await this.useCase.execute(dto);
    return {
      id: result.id,
      consentGiven: result.consentGiven,
      createdAt: result.createdAt,
    };
  }
}
