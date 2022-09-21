import { IsNotEmpty, IsString } from 'class-validator';

export class CreateUrlPairDto {
  @IsNotEmpty()
  @IsString()
  short_url: string;

  @IsNotEmpty()
  @IsString()
  full_url: string;
}
