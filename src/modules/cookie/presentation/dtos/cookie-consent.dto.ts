import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CookieConsentDto {
  @IsNotEmpty()
  @IsString()
  cookieName!: string;

  @IsNotEmpty()
  @IsBoolean()
  consentGiven!: boolean;
}
