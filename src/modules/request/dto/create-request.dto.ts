import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { Field, RequestStatus } from 'src/common/enum';
import { Media, ResponseMessage } from 'src/common/types';
export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty()
  @IsString()
  @MaxLength(1000)
  content: string;

  @ApiProperty()
  @IsOptional()
  media?: Media[];

  @ApiProperty()
  @IsOptional()
  @IsString()
  userRequestId?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  userResponseId?: string;

  @ApiProperty()
  @IsEnum(Field)
  field: Field;

  @ApiProperty()
  @IsOptional()
  @IsEnum(RequestStatus)
  // Default: RequestStatus = RequestStatus.PENDING;
  status?: RequestStatus;

  @ApiProperty()
  @IsOptional()
  responseMessage?: ResponseMessage[];
}
