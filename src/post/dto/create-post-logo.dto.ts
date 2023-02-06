import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostLogoDto {
  @IsNotEmpty()
  @IsString()
  readonly id: string;

  @IsNotEmpty()
  @IsString()
  readonly url: string;
}
