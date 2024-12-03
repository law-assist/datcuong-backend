/* eslint-disable @typescript-eslint/no-unused-vars */
import { AutoMap } from '@automapper/classes';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { BaseSchema, BaseSchemaFactory } from 'src/common/base/base.schema';
import { Category, Field } from 'src/common/enum/enum';
import { LawContent, LawRelation } from 'src/common/types';

export type LawDocument = HydratedDocument<Law>;

@Schema({ versionKey: false })
export class Law extends BaseSchema {
  @AutoMap()
  @Prop({ required: true })
  name: string;

  @AutoMap()
  @Prop({ required: true, type: String, enum: Category })
  category: Category;

  @AutoMap()
  @Prop({ required: true })
  department: string;

  @Prop({ required: true, unique: true, type: String, name: 'base_url' })
  baseUrl: string;

  @AutoMap()
  @Prop({ required: false, unique: true, type: String, name: 'pdf_url' })
  pdfUrl: string;

  @AutoMap()
  @Prop({ required: true, unique: false, name: 'number_doc' })
  numberDoc: string;

  @AutoMap()
  @Prop({ required: true, name: 'date_approved' })
  dateApproved: Date;

  @AutoMap()
  @Prop({ required: true, type: [String], enum: Field })
  fields: Field[];

  @AutoMap()
  @Prop({ required: true, type: Object })
  content: LawContent;

  @AutoMap()
  @Prop({ required: true, type: [Object], name: 'relation_laws' })
  relationLaws: any[];

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

LawSchema.add(BaseSchemaFactory);

LawSchema.index({ name: 'text' }, { default_language: 'none' });
LawSchema.index({ department: 1 });
LawSchema.index({ fields: 1 });
LawSchema.index({ category: 1 });
LawSchema.index({ numberDoc: 1 });
LawSchema.index({ dateApproved: -1 });
LawSchema.index({ category: 1, department: 1 });

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
