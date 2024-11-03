import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  BadRequestException,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/decorators/roles.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { User } from 'src/common/decorators/user.decorator';
import { API_BEARER_AUTH } from 'src/constants/constants';
// import { ReadUserDto } from '../user/dto/read-user.dto';
// import { UserService } from '../user/user.service';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
@ApiTags('auth')
@ApiBearerAuth(API_BEARER_AUTH)
export class AuthController {
  constructor(
    private authService: AuthService,
    // private userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  signIn(@Body() signInDto: UserDto) {
    return this.authService.signIn(signInDto);
  }

  @Public()
  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }

  @Get('refresh-token')
  async refreshToken(@User() user: any) {
    const tokens = await this.authService.getTokens({ user });

    if (!tokens) {
      throw new BadRequestException('refresh_token_failed');
    }
    return {
      data: tokens,
      message: 'refresh_token_success',
      status: 'success',
    };
  }
}
