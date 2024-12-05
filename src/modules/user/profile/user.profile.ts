/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { ReadUserDto } from '../dto/read-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        User,
        ReadUserDto,
        forMember(
          (destination) => destination._id,
          mapFrom((source) => source._id),
        ),
      );
      createMap(mapper, CreateUserDto, User);
      createMap(
        mapper,
        UpdateUserDto,
        User,
        // forMember(
        //   (destination) => destination.name,
        //   mapFrom((source) => source.name),
        // ),
      );
    };
  }
}
