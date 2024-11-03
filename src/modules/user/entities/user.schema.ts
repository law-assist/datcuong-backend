import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AutoMap } from '@automapper/classes';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/base/base.schema';
import { Field, Role, UserStatus } from 'src/common/enum/enum';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false })
export class User extends BaseSchema {
  @AutoMap()
  @Prop({
    required: true,
    name: 'full_name',
    type: String,
  })
  fullName: string;

  @AutoMap()
  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  email: string;

  @AutoMap()
  @Prop({
    required: false,
    unique: true,
    type: String,
    name: 'phone_number',
  })
  phoneNumber: string;

  @AutoMap()
  @Prop({
    required: false,
    type: Date,
  })
  dob: Date;

  @AutoMap()
  @Prop({
    required: false,
  })
  address: string;

  @Prop({
    required: true,
  })
  password: string;

  @AutoMap()
  @Prop({
    required: false,
    type: String,
    name: 'avatar_url',
    default: 'https://i.imgur.com/2v0j0j6.png',
  })
  avatarUrl: string;

  @AutoMap()
  @Prop({
    required: false,
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @AutoMap()
  @Prop({
    required: false,
    type: [String],
    enum: Field,
    default: [],
  })
  fields: Field[];

  @AutoMap()
  @Prop({
    required: false,
    type: String,
    enum: UserStatus,
    default: UserStatus.UNVERIFIED,
  })
  status: UserStatus;

  @Prop({
    required: false,
    type: String,
    name: 'email_verify_token',
  })
  emailVerifyToken: string;

  @Prop({
    required: false,
    type: String,
    name: 'password_forgot_token',
  })
  passwordForgotToken: string;
}

const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

UserSchema.pre('findOneAndDelete', function (next) {
  this.set({ updatedAt: new Date() });
  this.set({ isDeleted: true });
  next();
});

export { UserSchema };
