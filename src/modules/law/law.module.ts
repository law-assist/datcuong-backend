import { Module } from '@nestjs/common';
import { LawService } from './law.service';
import { LawController } from './law.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Law, LawSchema } from './entities/law.schema';
import { LawProfile } from './profile/field.profile';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Law.name, schema: LawSchema }]),
    HttpModule.register({
      timeout: 10 * 60 * 1000,
      maxRedirects: 5,
    }),
  ],
  controllers: [LawController],
  providers: [LawService, LawProfile],
  exports: [LawService],
})
export class LawModule {}
