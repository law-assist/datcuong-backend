import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { RequestService } from './request.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { User } from 'src/common/decorators/user.decorator';
import { ReadUserDto } from '../user/dto/read-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enum';

@Controller('request')
@ApiTags('request')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth(API_BEARER_AUTH)
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Post()
  async create(
    @User() user: ReadUserDto,
    @Body() createRequestDto: CreateRequestDto,
  ) {
    const res = await this.requestService.create(
      user._id.toString(),
      createRequestDto,
    );
    if (!res) {
      throw new BadRequestException('request_not_created');
    }

    return {
      message: 'success',
      // data: res,
    };
  }

  @Roles(Role.LAWYER)
  @Post('response/:id')
  async sendResponse(
    @User() user: ReadUserDto,
    @Body() body: any,
    @Param('id') id: string,
  ) {
    const res = await this.requestService.sendResponse(
      id,
      user._id.toString(),
      body,
    );
    if (!res) {
      throw new BadRequestException('response_not_sent');
    }

    return {
      message: 'success',
      data: res,
    };
  }

  @Roles(Role.ADMIN)
  @Get('all')
  async getAllUsers() {
    const request = await this.requestService.findAll();
    return {
      message: 'all_request',
      data: request,
    };
  }

  @Get('user')
  async getUserRequest(@User() user: ReadUserDto, @Query() query?: any) {
    const res = await this.requestService.getAllUserRequests(
      user._id.toString(),
      query,
    );

    if (!res) {
      throw new NotFoundException('request_not_found');
    }

    return {
      message: 'success',
      data: res,
    };
  }

  @Get('user/:id')
  async getUserRequestById(@User() user: ReadUserDto, @Param('id') id: string) {
    const res = await this.requestService.getUserRequest(
      id,
      user._id.toString(),
    );

    if (!res) {
      throw new NotFoundException('request_not_found');
    }

    return {
      message: 'success',
      data: res,
    };
  }

  @Roles(Role.LAWYER)
  @Get('lawyer')
  async getLawyerRequests(@User() user: ReadUserDto, @Query() query?: any) {
    const res = await this.requestService.getAllLawyerRequests(
      user._id.toString(),
      query,
    );

    if (!res) {
      throw new NotFoundException('request_not_found');
    }

    return {
      message: 'success',
      data: res,
    };
  }

  @Roles(Role.LAWYER)
  @Get('lawyer/:id')
  async getLawyerRequest(@User() user: ReadUserDto, @Param('id') id: string) {
    const res = await this.requestService.getLawyerRequest(
      id,
      user._id.toString(),
    );

    if (!res) {
      throw new NotFoundException('request_not_found');
    }

    return {
      message: 'success',
      data: res,
    };
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
