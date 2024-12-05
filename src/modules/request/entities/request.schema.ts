import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { BaseSchema, BaseSchemaFactory } from 'src/common/base/base.schema';
import { Field, RequestStatus } from 'src/common/enum';
import { Media, ResponseMessage } from 'src/common/types';

export type RequestDocument = HydratedDocument<Request>;
@Schema({ versionKey: false })
export class Request extends BaseSchema {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [{ type: SchemaTypes.Mixed }], required: false })
  media: Media[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  userRequestId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: false })
  userResponseId?: Types.ObjectId;

  @Prop({ type: String, enum: Field, required: true })
  field: Field;

  @Prop({ type: String, enum: RequestStatus, default: RequestStatus.PENDING })
  status: RequestStatus;

  @Prop({ type: [{ type: SchemaTypes.Mixed }], required: false })
  responseMessage: ResponseMessage[];
}

const RequestSchema = SchemaFactory.createForClass(Request);

RequestSchema.add(BaseSchemaFactory);

RequestSchema.index({ title: 'text' });
RequestSchema.index({ field: 1 });
RequestSchema.index({ status: 1 });
RequestSchema.index({ userRequestId: 1 });
RequestSchema.index({ userResponseId: 1 });

RequestSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

RequestSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

RequestSchema.pre('findOneAndDelete', function (next) {
  this.set({ updatedAt: new Date() });
  this.set({ isDeleted: true });
  next();
});

export { RequestSchema };
