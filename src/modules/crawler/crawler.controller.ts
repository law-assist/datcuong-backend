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
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/decorators/roles.decorator';

@Controller('crawler')
@ApiTags('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post()
  @Public()
  create(@Body() createCrawlerDto: CreateCrawlerDto) {
    return this.crawlerService.crawler(createCrawlerDto.url);
  }

  @Get()
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
