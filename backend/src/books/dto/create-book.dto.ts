import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsNumber,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  authors: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  isbn: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
