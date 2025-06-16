import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { SubmitFormUseCase } from '../application/submit-form.usecase';
import { SubmitFormDto } from './dtos';
import { ResponseDto } from 'src/common/dtos/response.dto';

@Controller('form')
export class SubmitFormController {
  constructor(private readonly submitForm: SubmitFormUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async execute(@Body() dto: SubmitFormDto) {
    const record = await this.submitForm.execute(dto);
    return new ResponseDto({
      data: { id: record.id, createdAt: record.createdAt },
      timestamp: new Date(),
    });
  }
}
