import {
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateLoanDto {
  @IsNumber()
  @IsNotEmpty()
  bookId: number;

  @IsNumber()
  @IsNotEmpty()
  librarianId: number;

  @IsNumber()
  @IsNotEmpty()
  memberId: number;

  @IsDateString()
  @IsNotEmpty()
  loanAt: string;

  @IsDateString()
  @IsOptional()
  returnedAt?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  note?: string;
}
