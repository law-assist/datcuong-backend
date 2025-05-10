import { ApiProperty } from '@nestjs/swagger';

export class ReqDto {
  @ApiProperty()
  word: string;
}
