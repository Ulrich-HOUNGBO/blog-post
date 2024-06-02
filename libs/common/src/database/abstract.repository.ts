import { AbstractDocument } from '@app/common/database/abstract.schema';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Logger, NotFoundException } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected readonly logger: Logger;
  protected constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });
    return (await createdDocument.save()).toJSON() as TDocument;
  }

  async find(filter: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filter).lean<TDocument[]>(true);
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    const document = this.model.findOne(filter).lean<TDocument>(true);
    if (!document) {
      this.logger.warn(`Document with id ${filter} not found`);
      throw new NotFoundException(`Document with id ${filter} not found`);
    }
    return document;
  }

  async findOneAndUpdate(
    id: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = this.model
      .findOneAndUpdate(id, update, { new: true })
      .lean<TDocument>();
    if (!document) {
      this.logger.warn(`Document with id ${id} not found`);
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return document;
  }

  async findOneAndDelete(id: FilterQuery<TDocument>): Promise<TDocument> {
    const document = this.model.findOneAndDelete(id).lean<TDocument>(true);
    if (!document) {
      this.logger.warn(`Document with id ${id} not found`);
      throw new NotFoundException(`Document with id ${id} not found`);
    }
    return document;
  }
}
