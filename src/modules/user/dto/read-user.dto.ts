import { ObjectId } from 'mongodb';
import { CreateUserDto } from './create-user.dto';
import { Role, UserStatus } from 'src/common/enum/enum';

export class ReadUserDto extends CreateUserDto {
  _id: ObjectId;
  avatarUrl: string;
  role: Role;
  status: UserStatus;
  field: string[] = [];
}
