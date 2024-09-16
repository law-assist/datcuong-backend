import { IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
import { Field } from 'src/common/enum/enum';
import { LawContent, LawRelation } from 'src/common/types';

export class CreateLawDto {
  @IsString()
  name: string;

  @IsString()
  category: string;

  @IsString()
  department: string;

  @IsString()
  @IsUrl()
  pdfUrl: string;

  @IsString()
  @IsUrl()
  baseUrl: string;

  @IsString()
  numberDoc: string;

  @IsString()
  dateApproved: string;

  @IsEnum(Field)
  fields: Field[];

  @IsObject()
  content: LawContent;

  @IsOptional()
  @IsString()
  relationLaws?: LawRelation[];
}
