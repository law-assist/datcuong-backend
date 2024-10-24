import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, CallbackError } from 'mongoose';
import * as moment from 'moment-timezone';

@Schema({ versionKey: false })
export class BaseSchema extends Document {
  @Prop({
    default: () => moment().tz('Asia/Bangkok').toDate(),
    type: Date,
    name: 'created_at',
  })
  createdAt: Date;

  @Prop({
    default: () => moment().tz('Asia/Bangkok').toDate(),
    type: Date,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Prop({
    default: false,
    type: Boolean,
    name: 'is_deleted',
  })
  isDeleted: boolean;
}

const BaseSchemaFactory = SchemaFactory.createForClass(BaseSchema);

BaseSchemaFactory.pre('save', function (next: (err?: CallbackError) => void) {
  this.updatedAt = moment().tz('Asia/Bangkok').toDate();
  next();
});

BaseSchemaFactory.pre(
  'findOneAndUpdate',
  function (next: (err?: CallbackError) => void) {
    this.set({ updatedAt: moment().tz('Asia/Bangkok').toDate() });
    next();
  },
);

BaseSchemaFactory.pre(
  'findOneAndDelete',
  function (next: (err?: CallbackError) => void) {
    this.set({ updatedAt: moment().tz('Asia/Bangkok').toDate() });
    this.set({ isDeleted: true });
    next();
  },
);

BaseSchemaFactory.pre(
  'deleteOne',
  { document: true, query: false },
  function (next: (err?: CallbackError) => void) {
    this.isDeleted = true;
    this.save();
    next();
  },
);

export { BaseSchemaFactory };
