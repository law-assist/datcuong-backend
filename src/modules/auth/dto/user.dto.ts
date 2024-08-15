import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserDto {
  @IsEmail({}, { message: 'invalid_email' })
  @ApiProperty()
  email: string;

  @IsString()
  @Length(6, 30, { message: 'Password must be between 6 and 30 characters' })
  @Matches(/(?=.*[A-Z])(?=.*[0-9])/, {
    message: 'Password must contain an uppercase letter and a number',
  })
  @ApiProperty()
  password: string;
}
