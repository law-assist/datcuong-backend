/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from './../interceptors/response.interceptor';
import { RelationType } from 'typeorm/metadata/types/RelationTypes';
import { MediaType } from '../enum/enum';

//
export interface Context {
  name: string;
  value: string;
  content: (Content | Context)[];
  embedding: string | '';
  internal_ner: string[] | [];
  tag: string | '';
  classification: string | '';
  reference: string[] | [];
  parent_ner: string[] | [];
  aggregation_ner: string[] | [];
}

export interface Content {
  name: string;
  value: string;
  embedding: string | '';
  classification: string | '';
  internal_ner: string[] | [];
  reference: string[] | [];
}

export interface LawContent {
  header: Content[];
  description: Content[];
  mainContent: Context[];
  footer: Content[];
  extend: string[];
}

export interface LawRelation {
  srcDir: string;
  descDir: string;
  type: RelationType;
  note: string;
  createdAt: Date | Date.now;
  updatedAt: Date | Date.now;
}

export interface Media {
  url: string;
  name: string;
  type: MediaType;
}

export interface ResponseMessage {
  _id: string;
  sender_id: string;
  content: string;
  medias?: Media[];
  createdAt: Date;
  updatedAt: Date;
}
export interface Options {
  page: number;
  limit: number;
}

export interface LawQuery {
  name: string;
  field: string;
  category: string;
  department: string;
  year: string;
  page: number;
  size: number;
}
