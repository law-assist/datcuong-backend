import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection, Model } from 'mongoose';
import { User } from './entities/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { ReadUserDto } from './dto/read-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {}

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

  async getUserProfile(id: string): Promise<ReadUserDto> {
    const user = await this.userModel.findOne({ _id: new ObjectId(id) });

    // return {
    //   message: 'user_profile',
    //   data: this.mapper.map(user, User, ReadUserDto),
    // };

    return user ? this.mapper.map(user, User, ReadUserDto) : null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (err) {
      console.error('Error creating user:', err.message);
      if (err.keyPattern.email) {
        throw new BadRequestException('email_exist');
      }
      if (err.keyPattern.phoneNumber) {
        throw new BadRequestException('phone_number_exist');
      }
      return;
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | any> {
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
      console.log(err.message);
      if (err.keyPattern.email) {
        return 'email_exist';
      }
      if (err.keyPattern.phoneNumber) {
        return 'phone_number_exist';
      }
      return 'user_update_failed';
    }
  }

  async remove(id: string): Promise<User | any> {
    const _id = new ObjectId(id);
    return await this.userModel.deleteOne({ _id: _id });
  }
}
