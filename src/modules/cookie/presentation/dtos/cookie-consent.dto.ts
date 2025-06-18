import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
export class CookieConsentDto {
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
