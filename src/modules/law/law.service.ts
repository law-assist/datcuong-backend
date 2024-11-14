//
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Mapper } from '@automapper/core';

import { Law } from './entities/law.schema';
import { UpdateLawDto } from './dto/update-law.dto';

import { CreateLawDto } from './dto/create-law.dto';
import { LawQuery } from 'src/common/types';
import { hightLawList } from 'src/common/const';
// import { Category, Department, Field } from 'src/common/enum/enum';

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
      console.error('Error creating law:', err);
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
      // {
      //   $addFields: {
      //     dateApproved: {
      //       $dateFromString: {
      //         dateString: '$dateApproved',
      //         format: '%d/%m/%Y', // Specify the format as DD/MM/YYYY
      //       },
      //     },
      //   },
      //   // $addFields: {
      //   //   dateApprovedLength: { $strLenCP: '$dateApproved' }, // Calculate length of dateApproved string
      //   // },
      // },
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
    return await this.lawModel.findById(id);
  }

  async searchLaw(query?: LawQuery) {
    const { name, field, category, department, year } = query;
    const page = Number(query.page) || 1;
    const size = Number(query.size) || 10;
    // const year = query.year
    //   ? query.year.toString()
    //   : name
    //     ? null
    //     : new Date().getFullYear().toString();
    // new Date().getFullYear().toString()
    try {
      const matchConditions: any[] = [{ isDeleted: false }];

      if (year) {
        matchConditions.push({
          $expr: {
            $eq: [{ $year: '$dateApproved' }, parseInt(year)],
          },
        });
      }

      if (field) {
        matchConditions.push({
          fields: field,
        });
      }

      if (category) {
        matchConditions.push({
          category: category,
        });
      }

      if (name) {
        matchConditions.push({
          $text: {
            $search: name,
            $caseSensitive: false,
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

      const matchStage =
        matchConditions.length > 0 ? { $and: matchConditions } : {};

      const result = await this.lawModel.aggregate([
        { $match: matchStage },
        // { $sort: { dateApproved: -1 } },
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

  async getLastLaw() {
    const lastLaw = await this.lawModel.findOne({ isDeleted: false }).sort({
      _id: -1,
    });
    return lastLaw;
  }

  async getAllDepartments() {
    const departments = await this.lawModel
      .find({ isDeleted: false })
      .distinct('department');
    return departments;
  }

  async getAllCategories() {
    const categories = await this.lawModel.distinct('category');
    return categories;
  }

  async softDeleteLawByDepartment(word: string) {
    try {
      const res = await this.lawModel.updateMany(
        {
          //department contains word
          department: { $regex: word, $options: 'i' },
          isDeleted: false,
        },
        {
          isDeleted: true,
          deletedAt: new Date(),
        },
      );
      console.log('Soft deleted laws by department:', res.modifiedCount);
      return;
    } catch (err: any) {
      console.error('Error soft deleting law by department:', err); // Use a more descriptive message
      throw new Error(
        `Failed to soft delete law by department: ${err.message}`,
      );
    }
  }

  async softDeleteUnnecessaryLaws() {
    while (true) {
      try {
        const laws: any[] = await this.lawModel
          .find({
            category: { $nin: hightLawList },
            isDeleted: false,
          })
          .limit(100);
        if (laws.length === 0) {
          return;
        }
        for (const law of laws) {
          const res = await this.remove(law._id);
          if (res) {
            console.log('Soft deleted:', law.baseUrl);
          }
        }
      } catch (err: any) {
        console.error('Error soft deleting unnecessary laws:', err); // Use a more descriptive message
        // throw new Error(
        //   `Failed to soft delete unnecessary laws: ${err.message}`,
        // );
      }
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
    const law = await this.lawModel.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });
    if (!law) {
      throw new NotFoundException('not_found');
    }
    return law;
  }

  async dateStringToDates() {
    try {
      while (true) {
        const laws = await this.lawModel
          .find({
            dateApproved: { $type: 'string' },
          })
          .limit(100);
        if (laws.length === 0) {
          return;
        }

        for (const law of laws) {
          const dateStr = law.dateApproved;
          // const [day, month, year] = dateStr.split('/');
          // const date = new Date(`${year}-${month}-${day}`);

          const res = await this.lawModel.updateOne(
            { _id: law._id },
            { $set: { dateApproved: dateStr } },
          );

          if (res.modifiedCount > 0) {
          }
        }
      }
    } catch (err: any) {
      console.error('Error converting date strings to dates:', err); // Use a more descriptive message
      // throw new Error(
      //   `Failed to convert date strings to dates: ${err.message}`,
      // );
    }
  }
}
