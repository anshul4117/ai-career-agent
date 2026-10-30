import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class RegisterDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email: string;

  @IsString({ message: "Password must be a string" })
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  @MaxLength(100, { message: "Password must not exceed 100 characters" })
  @IsNotEmpty({ message: "Password is required" })
  password: string;

  @IsString({ message: "Full name must be a string" })
  @IsNotEmpty({ message: "Full name is required" })
  @MaxLength(100, { message: "Full name must not exceed 100 characters" })
  fullName: string;
}
