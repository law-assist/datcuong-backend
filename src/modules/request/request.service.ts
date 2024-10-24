import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.schema';
import { Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RequestService {
  constructor(
    @InjectModel(Request.name) private requestModel: Model<Request>,
    @InjectConnection() private connection: Connection,
    // @InjectMapper()
    // public readonly mapper: Mapper,
  ) {}

  async create(uid: string, createRequestDto: CreateRequestDto) {
    const req = await this.requestModel.create({
      ...createRequestDto,
      userRequestId: uid,
    });
    return req;
  }

  async getAllUserRequest(uid: string, query: any) {
    const { limit = 5, page = 1 } = query;
    const objectId = new Types.ObjectId(uid); // Convert to ObjectId

    const result = await this.requestModel
      .aggregate([
        {
          $match: { userRequestId: objectId },
        },
        {
          $facet: {
            total: [{ $count: 'count' }],
            data: [
              { $limit: limit },
              { $skip: (page - 1) * limit },
              {
                $lookup: {
                  from: 'users', // The collection name for 'User'
                  localField: 'userResponseId', // The field in 'YourModel'
                  foreignField: '_id', // The field in 'User'
                  as: 'userResponse', // Alias for populated field
                },
              },
              {
                $unwind: {
                  path: '$userResponse',
                  preserveNullAndEmptyArrays: true, // Ensures documents are returned even if there's no match
                },
              },
              {
                $project: {
                  title: 1,
                  content: 1,
                  status: 1,
                  createdAt: 1,
                  userRequestId: 1,
                  userResponseId: 1,
                  'userResponse.fullName': 1,
                },
              },
            ],
          },
        },
      ])
      .exec();

    const data = result[0].data;
    const total = result[0].total.length > 0 ? result[0].total[0].count : 0;

    return { data, total };
  }

  findOne(id: string) {
    return `This action returns a #${id} request`;
  }

  async update(id: string, updateRequestDto: UpdateRequestDto) {
    return await this.requestModel.findByIdAndUpdate(id, updateRequestDto);
  }

  remove(id: string) {
    return `This action removes a #${id} request`;
  }
}
