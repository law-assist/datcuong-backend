import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema } from 'src/common/base/base.schema';
import { Field } from 'src/common/enum/enum';
import { LawContent, LawRelation } from 'src/common/types';

export type LawDocument = HydratedDocument<Law>;

@Schema({ versionKey: false })
export class Law extends BaseSchema {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true, unique: true, type: String, name: 'base_url' })
  baseUrl: string;

  @Prop({ required: false, unique: true, type: String, name: 'pdf_url' })
  pdfUrl: string;

  @Prop({ required: true, name: 'number_doc' })
  numberDoc: string;

  @Prop({ required: true, name: 'date_approved' })
  dateApproved: string;

  @Prop({ required: true, type: [String], enum: Field })
  fields: Field[];

  @Prop({ required: true, type: Object })
  content: LawContent;

  @Prop({ required: true, type: [Object], name: 'relation_laws' })
  relationLaws: LawRelation[];

  // @Prop({
  //   required: true,
  //   type: String,
  //   name: 'date_effective',
  // })
  // dateEffective: string;

  // @Prop({
  //   required: true,
  //   type: String,
  //   name: 'date_expired',
  // })
  // dateExpired: string;
}

const LawSchema = SchemaFactory.createForClass(Law);

LawSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

LawSchema.pre('findOneAndUpdate', function (next) {
  this.set({ updatedAt: new Date() });
  next();
});

LawSchema.pre('findOneAndDelete', function (next) {
  this.set({ updatedAt: new Date() });
  this.set({ isDeleted: true });
  next();
});

export { LawSchema };
