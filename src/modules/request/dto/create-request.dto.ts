import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Field, RequestStatus } from 'src/common/enum/enum';
import { Media, ResponseMessage } from 'src/common/types';
export class CreateRequestDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  media?: Media[]; // Optional field for media

  @IsString() // Expecting string to represent ObjectId in DTO
  userRequestId: string; // Required, referencing the User making the request

  @IsOptional()
  @IsString() // Optional, referencing the User responding to the request
  userResponseId?: string;

  @IsEnum(Field)
  field: Field; // Enum for the field category

  @IsOptional()
  @IsEnum(RequestStatus)
  status?: RequestStatus; // Optional status field

  @IsOptional()
  responseMessage?: ResponseMessage[]; // Optional response messages
}
