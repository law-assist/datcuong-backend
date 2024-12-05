import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IsString, Length, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { Role } from 'src/common/enum';

export class CreateUserDto {
  @AutoMap()
  @IsString()
  @ApiProperty()
  fullName: string;

  @AutoMap()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @Length(10, 10, { message: 'Phone number must be 10 characters' })
  @ApiProperty()
  phoneNumber?: string;

  // @IsDate()
  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    format: 'date-time',
  })
  dob?: Date;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty()
  address?: string;

  @IsString()
  @ApiProperty()
  password: string;

  @AutoMap()
  @IsEnum(Role)
  @ApiProperty({ enum: Role, default: Role.USER })
  @IsOptional()
  role?: Role;
}
