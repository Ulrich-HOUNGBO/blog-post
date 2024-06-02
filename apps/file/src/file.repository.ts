import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '@app/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileAwsDocument } from './models/file.schema';
import { UsersRepository } from '../../auth/src/users/users.repository';

@Injectable()
export class FileAwsRepository extends AbstractRepository<FileAwsDocument> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(FileAwsDocument.name)
    fileAwsModel: Model<FileAwsDocument>,
  ) {
    super(fileAwsModel);
  }
}
