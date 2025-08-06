import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection, Model } from 'mongoose';
import { User } from './entities/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadUserDto } from './dto/read-user.dto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    @InjectMapper()
    public readonly mapper: Mapper,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const email = this.configService.get<string>('DEFAULT_USER_EMAIL');
    const existingUser = await this.userModel.findOne({ email });

    if (!existingUser) {
      const password = this.configService.get<string>('DEFAULT_USER_PASSWORD');
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser: CreateUserDto = {
        fullName: this.configService.get<string>('DEFAULT_USER_FULLNAME'),
        email,
        password: hashedPassword,
        role: this.configService.get<Role>('DEFAULT_USER_ROLE') || Role.USER,
        phoneNumber: this.configService.get<string>('DEFAULT_USER_PHONE'),
        address: this.configService.get<string>('DEFAULT_USER_ADDRESS'),
        dob: new Date(this.configService.get<string>('DEFAULT_USER_DOB')),
      };

      await this.userModel.create(newUser);
      console.log('✅ Default user created');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find();
  }

  async getUser(email: string, password: string): Promise<ReadUserDto | any> {
    const user = await this.userModel.findOne({
      email: email,
      password: password,
    });
    return user ? this.mapper.map(user, User, ReadUserDto) : null;
  }

  async getUserProfile(id: string): Promise<User> {
    const user = await this.userModel.findOne(
      { _id: new ObjectId(id) },
      { password: 0 },
    );

    return user;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (err) {
      // console.error('Error creating user:', err.message);
      if (err.keyPattern.email) {
        throw new BadRequestException('email_exist');
      }
      if (err.keyPattern.phoneNumber) {
        throw new BadRequestException('phone_number_exist');
      }
      return;
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any> {
    const _id = new ObjectId(id);
    try {
      const res = await this.userModel.updateOne({ _id: _id }, updateUserDto);
      if (res.matchedCount === 0) {
        return;
      }
      if (res.modifiedCount === 0) {
        return 'user_not_updated';
      }
      return 'user_updated';
    } catch (err) {
      if (err?.keyPattern?.email) {
        return 'email_exist';
      }
      if (err?.keyPattern?.phoneNumber) {
        return 'phone_number_exist';
      }
      return 'user_update_failed';
    }
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundException('not_found');
    }
    return user;
  }
}
