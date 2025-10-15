import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  BadRequestException,
  Get,
  Query,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { SubmitCookieConsentUseCase } from '../application/submit-cookie-consent.usecase';
import {
  CookieConsentDto,
  UpdateCookieConsentDto,
} from './dtos/cookie-consent.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetCookieConsentsUseCase } from '../application/get-cookie-consents.usecase';
import { UpdateCookieConsentUseCase } from '../application/update-cookie-consent.usecase';
import { DeleteCookieConsentUseCase } from '../application/delete-cookie-consent.usecase';

@ApiTags('Cookies')
@Controller('cookie-consent')
export class CookieConsentController {
  constructor(
    private readonly useCase: SubmitCookieConsentUseCase,
    private readonly getUseCase: GetCookieConsentsUseCase,
    private readonly updateUseCase: UpdateCookieConsentUseCase,
    private readonly deleteUseCase: DeleteCookieConsentUseCase,
  ) {}

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
  async submit(
    @Body() dto: CookieConsentDto,
    @Headers('x-anonymous-id') anonymousId: string,
  ) {
    if (!anonymousId || anonymousId !== dto.anonymousId) {
      throw new BadRequestException('Invalid or missing Anonymous ID');
    }
    return this.useCase.execute(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todos los consentimientos de un usuario anónimo',
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  async getConsents(
    @Headers('x-anonymous-id') anonymousId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
  ) {
    if (!anonymousId) {
      throw new BadRequestException('Invalid or missing Anonymous ID');
    }
    return this.getUseCase.execute(anonymousId, { skip, take });
  }

  @Patch(':cookieName')
  @ApiOperation({ summary: 'Actualizar consentimiento' })
  @ApiParam({ name: 'cookieName', description: 'Nombre de la cookie' })
  async update(
    @Headers('x-anonymous-id') anonymousId: string,
    @Param('cookieName') cookieName: string,
    @Body() dto: UpdateCookieConsentDto,
  ) {
    if (!anonymousId) {
      throw new BadRequestException('Missing X-Anonymous-ID header');
    }
    return this.updateUseCase.execute(anonymousId, cookieName, dto);
  }

  @Delete(':cookieName')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revocar/eliminar consentimiento' })
  @ApiParam({ name: 'cookieName', description: 'Nombre de la cookie' })
  async delete(
    @Headers('x-anonymous-id') anonymousId: string,
    @Param('cookieName') cookieName: string,
  ) {
    if (!anonymousId) {
      throw new BadRequestException('Missing X-Anonymous-ID header');
    }
    await this.deleteUseCase.execute(anonymousId, cookieName);
  }
}
