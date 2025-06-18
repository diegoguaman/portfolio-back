import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class NotificationDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email del destinatario',
  })
  @IsNotEmpty()
  @IsEmail()
  recipientEmail!: string;

  @ApiPropertyOptional({
    example: '+34123456789',
    description: 'Número de WhatsApp (opcional)',
  })
  @IsOptional()
  @IsString()
  recipientPhone?: string;

  @ApiProperty({
    example: 'Asunto de prueba',
    description: 'Asunto del mensaje',
  })
  @IsNotEmpty()
  @IsString()
  subject!: string;

  @ApiProperty({
    example: 'Este es el cuerpo del mensaje',
    description: 'Contenido del mensaje',
  })
  @IsNotEmpty()
  @IsString()
  message!: string;

  @ApiPropertyOptional({
    description: 'Variables para plantillas de WhatsApp',
    example: { date: '2025-06-20', time: '15:00' },
  })
  @IsOptional()
  templateVariables?: { date?: string; time?: string };
}
