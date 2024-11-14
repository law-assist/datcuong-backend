import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CreateCrawlerDto } from './dto/create-crawler.dto';
import { UpdateCrawlerDto } from './dto/update-crawler.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/decorators/roles.decorator';
import { API_BEARER_AUTH } from 'src/constants/constants';
import { Role } from 'src/common/enum/enum';

@Controller('crawler')
@ApiTags('crawler')
@Roles(Role.ADMIN)
@ApiBearerAuth(API_BEARER_AUTH)
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Public()
  @Post('url')
  create(@Body() createCrawlerDto: CreateCrawlerDto) {
    return this.crawlerService.crawler(createCrawlerDto.url);
  }

  @Public()
  @Get('auto')
  autoCrawler() {
    return this.crawlerService.crawlerAll();
  }

  @Get('find-all')
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return id;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCrawlerDto: UpdateCrawlerDto) {
    return {
      id,
      ...updateCrawlerDto,
    };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return id;
  }
}
