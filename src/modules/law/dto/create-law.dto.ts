import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { Field } from 'src/common/enum/enum';
import { LawContent, LawRelation } from 'src/common/types';

export class CreateLawDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  category: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  department: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  @IsUrl()
  pdfUrl: string;

  @ApiProperty()
  @IsString()
  @IsUrl()
  baseUrl: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  numberDoc: string;

  @ApiProperty()
  @AutoMap()
  @IsString()
  dateApproved: string;

  @ApiProperty()
  @AutoMap()
  @IsEnum(Field)
  fields: Field[];

  @ApiProperty()
  @AutoMap()
  @IsObject()
  content: LawContent;

  @ApiProperty()
  @AutoMap()
  @IsOptional()
  @IsString()
  relationLaws?: LawRelation[];
}
