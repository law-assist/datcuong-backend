import {
  Controller,
  // Get,
  Post,
  Body,
  HttpCode,
  UseInterceptors,
  // Patch,
  // Param,
  // Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { Public } from 'src/decorators/roles.decorator';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
// import { UserService } from '../user/user.service';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
@ApiTags('auth')
@Public()
export class AuthController {
  constructor(
    private authService: AuthService,
    // private userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  signIn(@Body() signInDto: UserDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  register(@Body() user: CreateUserDto) {
    return this.authService.signUp(user);
  }
}
