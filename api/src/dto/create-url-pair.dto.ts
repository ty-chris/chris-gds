import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUrlPairDto {
  @IsNotEmpty()
  @IsString()
  short_url: string;

  @IsOptional()
  @IsString()
  full_url: string;
}
