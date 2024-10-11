import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { UserDto } from './dto/user.dto';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { hashPassword } from 'src/common/crypto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signIn(user: UserDto): Promise<any> {
    const userRes: ReadUserDto = await this.userService.getUser(
      user.email,
      hashPassword(user.password),
    );
    if (!userRes) {
      throw new UnauthorizedException('login_failed');
    }
    const payload = {
      user: {
        _id: userRes._id,
        fullName: userRes.fullName,
        email: userRes.email,
        role: userRes.role,
        phoneNumber: userRes.phoneNumber,
        status: userRes.status,
        field: userRes.field,
        avatarUrl: userRes.avatarUrl,
      },
    };
    const tokens = await this.getTokens(payload);
    return {
      data: {
        user: payload.user,
        tokens,
      },
      message: 'login_success',
      status: 'success',
      statusCode: 200,
    };
  }

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    // Hash password
    const newUser = await this.userService.createUser({
      ...createUserDto,
      password: hashPassword(createUserDto.password),
    });
    if (!newUser) {
      throw new BadRequestException('user_create_failed');
    }
    return {
      message: 'user_created',
      status: 'success',
      statusCode: 201,
    };
  }

  async getTokens(payload: any) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: payload.user._id,
          user: payload.user,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: payload.user._id,
          user: payload.user,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(id: string): Promise<any> {
    const user = await this.userService.getUserProfile(id);
    if (!user) {
      throw new UnauthorizedException('user_not_found');
    }
    const payload = {
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        status: user.status,
        field: user.field,
        avatarUrl: user.avatarUrl,
      },
    };

    const tokens = await this.getTokens(payload);
    return tokens || null;
  }
}
