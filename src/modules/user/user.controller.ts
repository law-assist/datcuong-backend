import {
  Controller,
  // Get,
  Post,
  Body,
  Patch,
  UseInterceptors,
  Get,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from '../auth/dto/user.dto';
import { ReadUserDto } from './dto/read-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/decorators/user.decorator';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Controller('user')
@UseInterceptors(ResponseInterceptor)
@ApiTags('user')
@ApiBearerAuth(API_BEARER_AUTH)
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('user-profile')
  getUserProfile(@User() user: any) {
    return {
      message: 'user_profile',
      data: user,
    };
  }

  @Post('signin')
  signin(@Body() user: UserDto) {
    return this.service.getUser(user.email, user.password);
  }

  @Post('signup')
  register(@Body() user: ReadUserDto) {
    return this.service.createUser(user);
  }

  @Patch('update')
  update(@Body() updateUser: UpdateUserDto, @User() user: any) {
    return this.service.updateUser(user._id, updateUser);
  }
}
