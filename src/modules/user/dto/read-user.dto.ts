import { ObjectId } from 'mongodb';
import { CreateUserDto } from './create-user.dto';
import { UserStatus } from 'src/common/enum/enum';
import { AutoMap } from '@automapper/classes';

export class ReadUserDto extends CreateUserDto {
  @AutoMap()
  _id: ObjectId;

  @AutoMap()
  avatarUrl: string;

  @AutoMap()
  status: UserStatus;

  @AutoMap()
  field: string[] = [];
}
