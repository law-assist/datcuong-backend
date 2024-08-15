import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Connection, Model } from 'mongoose';
import { User } from './entities/user.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async getUser(email: string, password: string): Promise<CreateUserDto | any> {
    return this.userModel.findOne({ email: email, password: password });
  }

  async createUser(createUserDto: CreateUserDto): Promise<User | any> {
    try {
      const newUser = await this.userModel.create(createUserDto);
      return newUser;
    } catch (err) {
      if (err.keyPattern.email) {
        throw new BadRequestException('email_exists');
      }
      if (err.keyPattern.phoneNumber) {
        throw new BadRequestException('phone_number_exists');
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
      console.log(res);
      if (res.matchedCount === 0) {
        throw new BadRequestException('user_not_found');
      }
      if (res.modifiedCount === 0) {
        throw new BadRequestException('user_not_updated');
      }
      return {
        message: 'user_updated',
      };
    } catch (err) {
      if (err.keyPattern.email) {
        throw new BadRequestException('email_exists');
      }
      if (err.keyPattern.phoneNumber) {
        throw new BadRequestException('phone_number_exists');
      }
      throw new BadRequestException('user_not_updated');
    }
  }

  async remove(id: string): Promise<User | any> {
    const _id = new ObjectId(id);
    return await this.userModel.deleteOne({ _id: _id });
  }
}
