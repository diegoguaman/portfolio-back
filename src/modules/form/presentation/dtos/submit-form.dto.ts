import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SubmitFormDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ example: 'juan@correo.com' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Hola, me interesa...' })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiProperty({
    description: 'Consentimiento de cookies',
    type: 'object',
    additionalProperties: { type: 'boolean' },
    example: { analytics: true, marketing: false },
  })
  @IsNotEmpty()
  @IsObject()
  cookies!: Record<string, any>;
}
