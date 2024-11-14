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
import { Public, Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/common/enum/enum';
import { ReqDto } from './dto/req.dto';

@Controller('law')
@ApiTags('law')
@UseInterceptors(ResponseInterceptor)
@ApiBearerAuth(API_BEARER_AUTH)
export class LawController {
  constructor(private readonly lawService: LawService) {}

  @Get()
  findAll() {
    return this.lawService.findAll();
  }

  @Get('search')
  async search(@Query() query?: LawQuery) {
    const res = await this.lawService.searchLaw(query);
    if (!res) {
      throw new NotFoundException('law_not_found');
    }
    return {
      message: 'success',
      data: res,
    };
  }

  @Public()
  @Get('last-law')
  async getLastLaw() {
    const res = await this.lawService.getLastLaw();
    if (!res) {
      throw new NotFoundException('law_not_found');
    }
    return {
      message: 'success',
      data: res,
    };
  }

  @Roles(Role.ADMIN)
  @Get('string-to-date')
  async stringToDate() {
    await this.lawService.dateStringToDates();

    return {
      message: 'success',
    };
  }

  // @Get('fields')
  // async getFields() {
  //   return this.lawService.getFields();
  // }

  @Get('categories')
  async getCategories() {
    return {
      message: 'success',
      data: await this.lawService.getAllCategories(),
    };
  }

  @Get('departments')
  async getDepartments() {
    return {
      message: 'success',
      data: await this.lawService.getAllDepartments(),
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const law = await this.lawService.findOne(id);
    if (!law) {
      throw new NotFoundException('law_not_found');
    }

    return {
      message: 'success',
      data: law,
    };
  }

  @Post()
  create(@Body() createLawDto: CreateLawDto) {
    return this.lawService.create(createLawDto);
  }

  @Post('depatment')
  async removelaws(@Body() req: ReqDto) {
    await this.lawService.softDeleteLawByDepartment(req.word);
    return {
      message: 'success',
    };
  }

  @Patch('soft-delete')
  async softDelete() {
    await this.lawService.softDeleteUnnecessaryLaws();
    return {
      message: 'success',
    };
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
