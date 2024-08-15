import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsString, Length, IsDate, IsEmail, IsOptional } from 'class-validator';
import { Role } from 'src/common/enum/enum';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  fullName: string;

  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @Length(10, 10, { message: 'Phone number must be 10 characters' })
  @ApiProperty()
  phoneNumber: string;

  // @IsDate()
  @IsString()
  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  dob: Date;

  @IsString()
  @ApiProperty()
  address: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  @IsOptional()
  role?: Role;
}
