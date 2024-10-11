/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Law } from '../entities/law.schema';
import { CreateLawDto } from '../dto/create-law.dto';
import { UpdateLawDto } from '../dto/update-law.dto';
import { ReadLawDto } from '../dto/read-law.dto';

@Injectable()
export class LawProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Law,
        ReadLawDto,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id),
        ),
      );
      createMap(mapper, CreateLawDto, Law);
      createMap(
        mapper,
        UpdateLawDto,
        Law,
        // forMember(
        //   (destination) => destination.name,
        //   mapFrom((source) => source.name),
        // ),
      );
    };
  }
}
