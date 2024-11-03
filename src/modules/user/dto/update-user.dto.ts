import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsOptional, IsString, IsUrl } from 'class-validator';
import { Field, Role, UserStatus } from 'src/common/enum/enum';
import { AutoMap } from '@automapper/classes';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @AutoMap()
  @IsOptional()
  @IsString()
  @IsUrl()
  @ApiProperty()
  avatarUrl?: string;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty()
  role?: Role;

  @AutoMap()
  @IsOptional()
  @IsString()
  @ApiProperty()
  status?: UserStatus;

  @AutoMap()
  @IsOptional()
  @IsArray()
  @ApiProperty()
  fields?: Field[] = [];
}
