import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLawDto } from './dto/create-law.dto';
import { UpdateLawDto } from './dto/update-law.dto';
import { Law } from './entities/law.schema';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { LawQuery } from 'src/common/types';
import { removeVietnameseTones } from 'src/helpers';

@Injectable()
export class LawService {
  constructor(
    @InjectModel(Law.name) private lawModel: Model<Law>,
    @InjectConnection() private connection: Connection,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {}

  async create(createLawDto: CreateLawDto): Promise<Law> {
    try {
      const newLaw = await this.lawModel.create(createLawDto);
      return newLaw;
    } catch (err) {
      console.error('Error creating law:', err); // Use a more descriptive message
      throw new Error(`Failed to create law: ${err.message}`);
    }
  }

  async checkLawExistence(url: string): Promise<boolean> {
    try {
      const law = await this.lawModel.findOne({ baseUrl: url });
      if (law) {
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error checking law existence:', err); // Use a more descriptive message
      throw new Error(`Failed to check law existence: ${err.message}`);
    }
  }

  async findAll() {
    const page = 1,
      limit = 10; // Default values for page and limit

    const result = await this.lawModel.aggregate([
      {
        $addFields: {
          dateApproved: {
            $dateFromString: {
              dateString: '$dateApproved',
              format: '%d/%m/%Y', // Specify the format as DD/MM/YYYY
            },
          },
        },
        // $addFields: {
        //   dateApprovedLength: { $strLenCP: '$dateApproved' }, // Calculate length of dateApproved string
        // },
      },
      // {
      //   $project: {
      //     _id: 1,
      //     dateApproved: 1,
      //     dateApprovedLength: 1,
      //   },
      // },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [
            { $sort: { dateApproved: -1 } },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
        },
      },
    ]);

    // Extract results
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
    const laws = result[0].data;
    return laws ? { page, total, laws } : null;
  }

  async findOne(id: string) {
    const law = await this.lawModel.findById(id);
    if (!law) {
      throw new NotFoundException('not_found');
    }
    return {
      data: law,
      message: 'success',
    };
  }

  async searchLaw(query?: LawQuery) {
    // return await this.findAll();
    const { name, field, category, department, year } = query;
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const normalizedSearchName = name
        ? removeVietnameseTones(name).toLowerCase()
        : null;

      const matchConditions: any[] = [];

      if (name) {
        matchConditions.push({
          name: {
            $regex: name,
            $options: 'i',
          },
        });
      }

      if (field) {
        matchConditions.push({
          field: {
            $regex: field,
            $options: 'i',
          },
        });
      }

      if (category) {
        matchConditions.push({
          category: {
            $regex: category,
            $options: 'i',
          },
        });
      }

      if (department) {
        matchConditions.push({
          department: {
            $regex: department,
            $options: 'i',
          },
        });
      }

      if (year) {
        matchConditions.push({
          $expr: {
            $eq: [{ $year: '$dateApproved' }, parseInt(year)],
          },
        });
      }

      const matchStage =
        matchConditions.length > 0 ? { $and: matchConditions } : {};

      const result = await this.lawModel.aggregate([
        {
          $addFields: {
            dateApproved: {
              $dateFromString: {
                dateString: '$dateApproved',
                format: '%d/%m/%Y',
              },
            },
          },
        },
        { $match: matchStage },
        { $sort: { dateApproved: -1 } },
        {
          $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: (page - 1) * size }, { $limit: size }],
          },
        },
      ]);

      const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;
      const laws = result[0].data;

      return {
        page,
        total,
        laws,
      };
    } catch (err) {
      console.error('Error searching law:', err.message); // Use a more descriptive message
      return;
    }
  }

  async update(id: string, updateLawDto: UpdateLawDto) {
    const law = await this.lawModel.findByIdAndUpdate(id, updateLawDto);
    if (!law) {
      throw new NotFoundException('not_found');
    }
    return {
      message: 'success',
    };
  }

  async remove(id: string) {
    const law = await this.lawModel.findByIdAndDelete(id);
    if (!law) {
      throw new NotFoundException('not_found');
    }
    return {
      message: 'success',
    };
  }
}
