// file.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import AwsS3File from '@app/common/aws/s3-file';
import FileType from '../../../utils/file-type';
import { DatabaseModule, LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { FileAws } from './models/file.schema';
import { FileAwsRepository } from './file.repository';

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        DatabaseModule.forFeature([FileAws]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        LoggerModule,
      ],
      controllers: [FileController],
      providers: [FileService, FileType, FileAwsRepository, AwsS3File],
    }).compile();

    fileController = app.get<FileController>(FileController);
    fileService = app.get<FileService>(FileService);
  });

  describe('createFile', () => {
    it('should throw NotFoundException when file is undefined', async () => {
      const createFileDto = new CreateFileDto();
      await expect(
        fileController.createFile(createFileDto, undefined),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return a file when file is provided', async () => {
      const createFileDto = new CreateFileDto();
      const file = { filename: 'test.txt' } as Express.Multer.File;
      const result = {
        id: '4ff3a4ce-2abc-4902-94b8-0cdf419de25b',
        label: 'test.txt',
        path: 'https://example.com/test.txt',
        size: 1024,
        type: 'docs',
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        deletedAt: null,
      };

      jest.spyOn(fileService, 'createFileFromUpload').mockResolvedValue(result);

      await expect(
        fileController.createFile(createFileDto, file),
      ).resolves.toEqual(result);
    });
  });

  describe('updateFile', () => {
    it('should return updated file', async () => {
      const createFileDto = new CreateFileDto();
      const file = { filename: 'test.txt' } as Express.Multer.File;
      const result = {
        id: '4ff3a4ce-2abc-4902-94b8-0cdf419de25b',
        label: 'test.txt',
        path: 'https://example.com/test.txt',
        size: 1024,
        type: 'docs',
        createdAt: new Date(),
        updatedAt: new Date(),
        deleted: false,
        deletedAt: null,
      };

      jest.spyOn(fileService, 'updateFile').mockResolvedValue(result);

      await expect(
        fileController.updateFile('1', file, createFileDto),
      ).resolves.toEqual(result);
    });
  });

  describe('deleteFile', () => {
    it('should return deleted file id', async () => {
      const result = '1';

      jest.spyOn(fileService, 'deleteFile').mockResolvedValue(result);

      await expect(fileController.deleteFile('1')).resolves.toEqual(result);
    });
  });
});
