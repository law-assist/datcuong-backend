import { Injectable } from '@nestjs/common';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { Law } from './entities/law.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';

@Injectable()
export class LawService {
  constructor(
    @InjectModel(Law.name) private lawModel: Model<Law>,
    @InjectConnection() private connection: Connection,
  ) {}

  async create(createLawDto: CreateLawDto): Promise<Law> {
    try {
      console.log(createLawDto);
      const newLaw = await this.lawModel.create(createLawDto);
      return newLaw;
    } catch (err) {
      console.error('Error creating law:', err); // Use a more descriptive message
      throw new Error(`Failed to create law: ${err.message}`);
    }
  }
  findAll() {
    return `This action returns all law`;
  }

  findOne(id: string) {
    return `This action returns a #${id} law`;
  }

  update(id: string, updateLawDto: UpdateLawDto) {
    console.log(updateLawDto);
    return `This action updates a #${id} law`;
  }

  remove(id: string) {
    return `This action removes a #${id} law`;
  }
}
