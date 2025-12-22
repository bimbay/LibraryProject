import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  MinLength,
} from 'class-validator';
import { Role } from '@prisma/client';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  password: string; // TAMBAHAN

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;
}
