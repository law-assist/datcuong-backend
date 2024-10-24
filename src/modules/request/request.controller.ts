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

  @Get()
  findAll() {
    // return this.requestService.findAll();
  }

  @Get('user')
  async getUserRequest(@User() user: ReadUserDto, @Query() query?: any) {
    const res = await this.requestService.getAllUserRequest(
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requestService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestService.update(id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestService.remove(id);
  }
}
