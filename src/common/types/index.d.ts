/* eslint-disable @typescript-eslint/no-unused-vars */
import { Response } from './../interceptors/response.interceptor';
import { RelationType } from 'typeorm/metadata/types/RelationTypes';
import { MediaType } from '../enum/enum';

//
export interface Context {
  name: string;
  title: string;
  content: (Content | Context)[];
  tag: string | '';
}

export interface Content {
  value: string;
  embedding: string;
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
