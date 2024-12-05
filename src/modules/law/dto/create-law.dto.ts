/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { Category, Field } from 'src/common/enum';
import { LawContent, LawRelation } from 'src/common/types';

export class CreateLawDto {
  @ApiProperty()
  @AutoMap()
  @IsString()
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsEnum(Category)
  category: Category;

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
  dateApproved: Date;

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
  relationLaws?: any[];
}
