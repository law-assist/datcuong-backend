import { Module } from '@nestjs/common';
import { LawService } from './law.service';
import { LawController } from './law.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Law, LawSchema } from './entities/law.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Law.name, schema: LawSchema }])],
  controllers: [LawController],
  providers: [LawService],
  exports: [LawService],
})
export class LawModule {}
