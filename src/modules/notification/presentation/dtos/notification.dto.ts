import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class NotificationDto {
  @IsNotEmpty()
  @IsEmail()
  recipientEmail!: string;

  @IsOptional()
  @IsString()
  recipientPhone?: string;

  @IsNotEmpty()
  @IsString()
  subject!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsOptional()
  templateVariables?: { date?: string; time?: string };
}
