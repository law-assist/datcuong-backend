import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';
import { Field, Role, UserStatus } from 'src/common/enum/enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  role?: Role;

  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: UserStatus;

  @IsOptional()
  @IsArray()
  @ApiProperty()
  field?: Field[] = [];
}
