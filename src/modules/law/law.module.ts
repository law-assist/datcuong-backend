import { Module } from '@nestjs/common';
import { LawService } from './law.service';
import { LawController } from './law.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Law, LawSchema } from './entities/law.schema';
import { LawProfile } from './profile/field.profile';

@Module({
  imports: [MongooseModule.forFeature([{ name: Law.name, schema: LawSchema }])],
  controllers: [LawController],
  providers: [LawService, LawProfile],
  exports: [LawService],
})
export class LawModule {}
