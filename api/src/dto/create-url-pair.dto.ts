import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUrlPairDto {
  @IsOptional()
  @IsString()
  short_url: string;

  @IsNotEmpty()
  @IsString()
  full_url: string;
}
