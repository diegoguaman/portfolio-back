import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
export class CookieConsentDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Id anonimo del usuario',
  })
  @IsNotEmpty()
  @IsUUID()
  anonymousId: string;

  @ApiProperty({ example: 'analytics', description: 'Nombre de la cookie' })
  @IsNotEmpty()
  @IsString()
  cookieName!: string;

  @ApiProperty({
    example: true,
    description: 'Si el usuario acepta o no la cookie',
  })
  @IsNotEmpty()
  @IsBoolean()
  consentGiven!: boolean;
}

export class UpdateCookieConsentDto {
  @ApiProperty({
    example: false,
    description: 'Nuevo estado de consentimiento',
  })
  @IsBoolean()
  consentGiven!: boolean;
}
