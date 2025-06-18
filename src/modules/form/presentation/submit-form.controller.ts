import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmitFormUseCase } from '../application/submit-form.usecase';
import { SubmitFormDto } from './dtos';
import { ResponseDto } from 'src/common/dtos/response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Form')
@Controller('form')
export class SubmitFormController {
  constructor(private readonly submitForm: SubmitFormUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enviar datos de formulario de contacto' })
  @ApiResponse({
    status: 201,
    description: 'Formulario procesado correctamente',
  })
  async execute(@Body() dto: SubmitFormDto) {
    const record = await this.submitForm.execute(dto);
    return new ResponseDto({
      data: { id: record.id, createdAt: record.createdAt },
      timestamp: new Date(),
    });
  }
}
