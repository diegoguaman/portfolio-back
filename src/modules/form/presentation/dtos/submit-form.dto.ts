import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SubmitFormDto {
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @IsString()
  message!: string;

  @IsNotEmpty()
  @IsObject()
  cookies!: Record<string, any>;
}
