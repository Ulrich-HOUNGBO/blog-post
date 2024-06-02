// file.module.ts
import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { FileAwsRepository } from './file.repository';
import { FileAws } from './models/file.schema';
import FileType from '../../../utils/file-type';
import AwsS3File from '@app/common/aws/s3-file';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([FileAws]),
    LoggerModule,
    FileType,
  ],
  controllers: [FileController],
  providers: [FileService, FileAwsRepository, AwsS3File, FileType],
  exports: [FileAwsRepository, AwsS3File, FileType, FileService],
})
export class FileModule {}
