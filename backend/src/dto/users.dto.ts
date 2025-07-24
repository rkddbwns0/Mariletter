import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUser {
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  @MaxLength(25)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(11)
  phone: string;

  @IsNotEmpty()
  @IsDate()
  birth_day: Date;

  @IsNotEmpty()
  @IsString()
  sex: string;
}
