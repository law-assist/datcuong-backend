// import { IsEnum, IsObject, IsOptional, IsString, IsUrl } from 'class-validator';
// import { Field } from 'src/common/enum';
// import { LawContent, LawRelation } from 'src/common/types';
import { AutoMap } from '@automapper/classes';
import { CreateLawDto } from './create-law.dto';

export class ReadLawDto extends CreateLawDto {
  @AutoMap()
  _id: string;
}
