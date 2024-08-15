import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LawService } from './law.service';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';

@Controller('law')
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
