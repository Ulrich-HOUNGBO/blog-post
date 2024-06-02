// import { CreateFileDto } from './dto/create-file.dto';
// import { FileAws } from './models/file.models';

// export interface FileI {
//   create(createFileDto: CreateFileDto): Promise<FileAws>;
//   createFileFromUpload(
//     file: Express.Multer.File,
//     createFileDto: CreateFileDto,
//   ): Promise<FileAws>;
// }

export interface FileI {
  label?: string;

  path?: string;

  size?: number;

  type?: string;
}
