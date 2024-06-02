import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { FileAwsRepository } from './file.repository';
import AwsS3File from '@app/common/aws/s3-file';
import FileType from '../../../utils/file-type';
import { FileAwsDocument } from './models/file.schema';

@Injectable()
export class FileService {
  constructor(
    private readonly fileRepository: FileAwsRepository,
    private readonly awsS3File: AwsS3File,
    private readonly fileType: FileType,
  ) {}

  async findAll() {
    return await this.fileRepository.find({});
  }

  async create(createFileDto: CreateFileDto) {
    return await this.fileRepository.create(createFileDto);
  }

  async createFileFromUpload(
    file: Express.Multer.File,
    createFileDto: CreateFileDto,
  ): Promise<FileAwsDocument> {
    const path = await this.awsS3File.uploadFile(file);
    const fileType = this.fileType.determineFileType(file.mimetype);
    const fileEntity = createFileDto;
    fileEntity.label = file.originalname;
    fileEntity.path = path;
    fileEntity.size = file.size;
    fileEntity.type = fileType;

    return await this.create(fileEntity);
  }

  async updateFile(file: Express.Multer.File, id: string) {
    const fileEntity = await this.fileRepository.findOne({ _id: id });
    if (!fileEntity) {
      throw new NotFoundException('File not found');
    }
    await this.awsS3File.updateFile(file, fileEntity.path);
    await this.createFileFromUpload(file, fileEntity);
    return fileEntity;
  }

  async deleteFile(id: string) {
    console.log(id);
    const file = await this.fileRepository.findOne({ where: { _id: id } });
    console.log(file);
    if (!file) {
      throw new NotFoundException('File not found');
    }
    await this.awsS3File.deleteFile(file.path);
    return await this.fileRepository.findOneAndDelete({ _id: id });
  }
}
