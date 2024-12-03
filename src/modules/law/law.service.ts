//
import { InjectMapper } from '@automapper/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { Mapper } from '@automapper/core';
import { HttpService } from '@nestjs/axios';

import { Law } from './entities/law.schema';
import { UpdateLawDto } from './dto/update-law.dto';

import { CreateLawDto } from './dto/create-law.dto';
import { LawQuery, RefQuery } from 'src/common/types';
import { hightLawList } from 'src/common/const';
import { lastValueFrom, map } from 'rxjs';
// import { Category, Department, Field } from 'src/common/enum/enum';

@Injectable()
export class LawService {
  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Law.name) private lawModel: Model<Law>,
    @InjectConnection() private connection: Connection,
    @InjectMapper()
    public readonly mapper: Mapper,
  ) {}
  aiHost = process.env.AI_HOST ?? 'http://localhost:8000';

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

  async findByName(_name: string) {
    return await this.lawModel.findOne({ name: _name });
  }

  async findByUrl(url: string) {
    return await this.lawModel.findOne({ baseUrl: url });
  }

  async findOne(id: string) {
    return await this.lawModel.findById(id);
  }

  async searchLaw(query?: LawQuery) {
    const { name, field, category, department, year } = query || {};
    const page = Number(query?.page) || 1;
    const size = Number(query?.size) || 10;

    try {
      // Initialize match conditions
      const matchConditions: any[] = [{ isDeleted: false }];

      // Add year-based filtering
      if (year) {
        matchConditions.push({
          $expr: {
            $eq: [{ $year: '$dateApproved' }, parseInt(year, 10)],
          },
        });
      }

      // Add field-based filtering
      if (field) {
        matchConditions.push({ fields: field });
      }

      // Add category-based filtering
      if (category) {
        matchConditions.push({ category });
      }

      // Add regex-based department filtering
      if (department) {
        matchConditions.push({
          department: {
            $regex: department,
            $options: 'i', // Case insensitive
          },
        });
      }

      // Add text search for name (if provided)
      if (name) {
        matchConditions.push({
          $text: {
            $search: name,
            $caseSensitive: false,
            $diacriticSensitive: false,
          },
        });
      }

      // Create the match stage
      const matchStage =
        matchConditions.length > 0 ? { $and: matchConditions } : {};

      // Build the aggregation pipeline
      const pipeline: any[] = [{ $match: matchStage }];

      // Add sorting logic
      if (!name) {
        pipeline.push({ $sort: { dateApproved: -1 } }); // Default sorting by date
      } else {
        pipeline.push(
          {
            $addFields: {
              score: { $meta: 'textScore' }, // Add text match score
            },
          },
          {
            $match: {
              score: { $gt: 1 }, // Filter documents with score > 0.5
            },
          },
          { $sort: { score: -1 } }, // Sort by relevance if name is provided
        );
      }

      // Pagination and metadata
      pipeline.push({
        $facet: {
          metadata: [{ $count: 'total' }], // Total count of documents
          data: [
            { $skip: (page - 1) * size }, // Skip documents for pagination
            { $limit: size }, // Limit number of documents per page
            {
              $project: {
                _id: 1,
                name: 1,
                category: 1,
                department: 1,
                dateApproved: 1,
                fields: 1,
                numberDoc: 1,
                score: 1, // Explicitly include the score in the projection
              },
            },
          ],
        },
      });

      // Execute the aggregation pipeline
      const result = await this.lawModel.aggregate(pipeline);
      // .explain('executionStats');

      // Extract metadata and data
      const total = result[0]?.metadata[0]?.total || 0;
      const laws = result[0]?.data || [];

      // Return paginated result
      return {
        page,
        total,
        laws,
      };
    } catch (err) {
      // Log and handle errors
      console.error('Error searching law:', err.message);
      throw new Error(
        'An error occurred while searching for laws. Please try again later.',
      );
    }
  }

  async searchLawRef(query?: RefQuery) {
    const { lawId, LawRef, index, classification, type } = query || {};
    const law = await this.lawModel.findById(lawId);
    if (!law) {
      return null;
    }
    const lawRefArray = LawRef.split(',');

    if (lawRefArray.length === 0) {
      return {
        _id: law._id,
        name: law.name,
        ref: null,
        type,
        classification,
        index,
        content: null,
      };
    }
    let ref = law.content[lawRefArray[0].trim()];
    for (let i = 1; i < lawRefArray.length; i++) {
      if (ref.content) {
        ref = ref.content.filter((item: any) => {
          if (item.name === lawRefArray[i]) return item;
        })[[0]];
      } else {
        ref = ref.filter((item: any) => {
          if (item.name === lawRefArray[i]) return item;
        })[0];
      }
    }

    return {
      _id: law._id,
      name: law.name,
      ref: ref,
      type,
      classification,
      index,
      content:
        index > 0 && ref.content && index < ref.content.length
          ? ref.content[index - 1]
          : ref,
    };
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
          const res = await this.lawModel.findByIdAndUpdate(law._id, {
            isDeleted: true,
            deletedAt: new Date(),
          });
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
    const law = await this.lawModel.findByIdAndDelete(id);
    if (!law) {
      throw new NotFoundException('not_found');
    }
    return law;
  }

  async verifyLaw() {
    let isFinished = false;
    let skip = 0;

    while (!isFinished) {
      const laws = await this.lawModel
        .find({ isDeleted: false })
        .skip(skip)
        .limit(100)
        .sort({ _id: 1 });
      if (laws.length === 0) {
        isFinished = true;
      }
      for (const law of laws) {
        if (
          law.content.header.length === 0 ||
          law.content.description.length === 0 ||
          law.content.mainContent.length === 0 ||
          law.content.footer.length === 0
        ) {
          await this.remove(law._id.toString());
          console.log('Deleted:');
        } else skip++;
        console.log(law.baseUrl);
      }
    }
  }

  async renameLaw() {
    let isFinished = false;
    let skip = 55586;

    while (!isFinished) {
      const laws = await this.lawModel
        .find()
        .skip(skip)
        .limit(10)
        .sort({ _id: 1 });

      if (laws.length === 0) {
        isFinished = true;
      }
      for (const law of laws) {
        if (
          law?.content?.description[1]?.value &&
          law?.content?.description[0]?.value
        ) {
          console.log(law.content.description[1].value);
          await this.lawModel.findByIdAndUpdate(law._id, {
            name:
              law.content.description[0].value +
              ' ' +
              law.content.description[1].value,
          });
        }
        console.log(skip);
        skip++;
      }
    }
  }

  async referenceLawManual(id: string) {
    // const law = await this.lawModel.findById(id);
    const response = this.httpService
      .post(`${this.aiHost}/reference_matching/id_input`, {
        input_string_id: id,
      })
      .pipe(map((res) => res.data)); // Extracts `data` from the response

    const result = await lastValueFrom(response);

    if (result?.data) {
      const data = result.data;
      const updateData = result.update_data_in_db;

      const relationLaws = data.relationLaws.map((item: any) => {
        if ((item.id = '')) {
          item.id = item.original_name;
        }
        return item;
      });

      const doc = await this.lawModel.findById(data._id);
      doc.relationLaws.push(...relationLaws);
      doc.relationLaws = this.uniqueById(doc.relationLaws);
      doc.content = data.content;
      await doc.save();

      // await this.update(data._id, {
      //   content: data.content,
      //   relationLaws: data.relationLaws,
      // });

      for (const item of updateData) {
        const doc = await this.lawModel.findById(item._id);
        doc.relationLaws.push(...item.relationLaws);
        doc.relationLaws = this.uniqueById(doc.relationLaws);
        doc.content = item.content;
        await doc.save();

        // await this.update(item._id, {
        //   content: item.content,
        //   relationLaws: item.relationLaws,
        // });
      }

      console.log(result); // The HTTP response body
      return result;
    }

    return;
  }

  async referenceLawAuto() {
    let count = 0;
    let skip = 0;
    const limit = 100;
    let isFinished = false;

    while (!isFinished) {
      const laws = await this.lawModel
        .find({
          isDeleted: false,
        })
        .sort({ dateApproved: -1 })
        .skip(skip)
        .select('_id');

      if (laws.length === 0) {
        isFinished = true;
      } else {
        for (const law of laws) {
          count++;
          const ref = await this.referenceLawManual(law._id.toString());
          if (ref) {
            console.log('Referenced:', law._id);
          } else {
            console.log(count);
            return count;
          }
        }
        skip += limit;
      }
    }

    return count;
  }

  async getLawsWithLongNames() {
    try {
      const result = await this.lawModel.aggregate([
        {
          $addFields: {
            nameLength: { $strLenCP: '$name' }, // Calculate the length of the `name` field
          },
        },
        {
          $match: {
            nameLength: { $gt: 300 }, // Filter for names longer than 100 characters
            isDeleted: false, // Ensure the law is not marked as deleted
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            baseUrl: 1,
            nameLength: 1, // Optionally include the length for debugging or display
          },
        },
        {
          $limit: 10, // Limit the results to 10 documents
        },
        {
          $sort: { nameLength: -1 }, // Sort by the date approved, descending
        },
      ]);

      return result;
    } catch (err) {
      console.error('Error retrieving laws with long names:', err.message);
      return [];
    }
  }

  async getCustomLaws() {
    const laws = await this.lawModel
      .find({
        name: { $regex: 'SỬA ĐỔI, BỔ SUNG', $options: 'i' },
        category: 'Nghị định',
      })
      .limit(30);

    return laws;
  }

  uniqueById = (array: any[]) => {
    return array.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );
  };
}
