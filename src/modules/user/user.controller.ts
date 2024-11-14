import {
  Controller,
  Post,
  Body,
  Patch,
  UseInterceptors,
  Get,
  HttpCode,
  NotFoundException,
  BadRequestException,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../auth/dto/user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enum/enum';
// import { ReadUserDto } from './dto/read-user.dto';

@Controller('user')
@ApiTags('user')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth(API_BEARER_AUTH)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('user-profile')
  async getUserProfile(@User() user: any) {
    const getUser = await this.service.getUserProfile(user._id);
    if (!getUser) {
      throw new NotFoundException('user_not_found');
    }
    return {
      message: 'user_profile',
      data: getUser,
    };
  }

  @Roles(Role.ADMIN)
  @Post('signin')
  signin(@Body() user: UserDto) {
    return this.service.getUser(user.email, user.password);
  }

  @Roles(Role.ADMIN)
  @Post('signup')
  register(@Body() user: CreateUserDto) {
    return this.service.createUser(user);
  }

  // @Roles(Role.ADMIN)
  @HttpCode(200)
  @Patch('update')
  async update(@Body() updateUser: UpdateUserDto, @User() user: any) {
    const message = await this.service.updateUser(user._id, updateUser);
    if (!message) {
      return new NotFoundException('user_not_found');
    }
    if (message === 'user_updated') {
      return {
        message: message,
      };
    }

    throw new BadRequestException(message);
  }
}
