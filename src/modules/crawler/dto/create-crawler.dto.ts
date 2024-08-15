import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl } from 'class-validator';

export class CreateCrawlerDto {
  @IsString()
  @IsUrl()
  @ApiProperty()
  url: string;
}
