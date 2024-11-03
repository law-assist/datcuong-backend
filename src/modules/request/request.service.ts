import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Request } from './entities/request.schema';
import { Connection, Model, Types } from 'mongoose';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ResponseMessage } from 'src/common/types';
import { RequestStatus } from 'src/common/enum/enum';

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

  async sendResponse(id: string, uid: string, data: any) {
    const message: ResponseMessage = {
      _id: new Types.ObjectId().toString(),
      sender_id: uid,
      content: data.content,
      medias: data.medias ? data.medias : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const document = await this.requestModel.findById(id);

    if (!document || document.userRequestId.toString() !== uid) {
      return;
    }

    document.status = RequestStatus.END;

    document.responseMessage.push(message);

    const res = await document.save();
    console.log(res);

    return res;
  }

  async getAllUserRequest(uid: string, query: any) {
    const limit: number = query.limit || 5;
    const page: number = query.page - 1 || 0;
    const skip: number = page * limit;
    const objectId = new Types.ObjectId(uid); // Convert to ObjectId

    const result = await this.requestModel
      .aggregate([
        {
          $match: { userRequestId: objectId },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            total: [{ $count: 'count' }],
            data: [
              { $skip: skip },
              { $limit: limit },
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

  async getLawyerRequest(lawId: string, lawyerId: string) {
    const objectId = new Types.ObjectId(lawId); // Convert to ObjectId

    const result = await this.requestModel
      .aggregate([
        {
          $match: {
            _id: objectId,
            userRequestId: new Types.ObjectId(lawyerId),
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $facet: {
            data: [
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
                  createdAt: -1,
                  field: 1,
                  media: 1,
                  userRequestId: 1,
                  userResponseId: 1,
                  responseMessage: 1,
                  'userResponse.fullName': 1,
                },
              },
            ],
          },
        },
      ])
      .exec();
    const data = result[0].data;
    console.log(data);
    return data[0];
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
