import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  NotFoundException,
  // ValidationPipe,
} from '@nestjs/common';
import { LawService } from './law.service';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LawQuery } from 'src/common/types';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';
import { API_BEARER_AUTH } from 'src/constants/constants';

@Controller('law')
@ApiTags('law')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth(API_BEARER_AUTH)
export class LawController {
  constructor(private readonly lawService: LawService) {}

  @Post()
  create(@Body() createLawDto: CreateLawDto) {
    return this.lawService.create(createLawDto);
  }

  @Get()
  findAll() {
    return this.lawService.findAll();
  }

  @Get('search')
  async search(@Query() query?: LawQuery) {
    console.log('query', query);
    const res = await this.lawService.searchLaw(query);
    if (!res) {
      throw new NotFoundException('law_not_found');
    }
    console.log('res', res);
    return {
      message: 'success',
      data: res,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.lawService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLawDto: UpdateLawDto) {
    return this.lawService.update(id, updateLawDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lawService.remove(id);
  }
}
