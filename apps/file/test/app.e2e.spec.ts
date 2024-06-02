import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { FileService } from '../src/file.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, LoggerModule } from '@app/common';
import { FileAws } from '../src/models/file.schema';
import { FileController } from '../src/file.controller';
import FileType from '../../../utils/file-type';
import { FileRepository } from '../src/file.repository';
import AwsS3File from '@app/common/aws/s3-file';

describe('FileController (e2e)', () => {
  let app: INestApplication;
  const fileService = FileService;
  let createdFile: IFile;

  interface IFile {
    id: string;
    deleted: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    label: string;
    path: string;
    size: number;
    type: string;
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        DatabaseModule.forFeature([FileAws]),
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        LoggerModule,
      ],
      controllers: [FileController],
      providers: [FileService, FileType, FileRepository, AwsS3File],
    })
      .overrideProvider('FileService')
      .useValue(fileService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const response = await request(app.getHttpServer())
      .post('/file')
      .attach('file', 'C:\\Users\\uhoun\\Projects\\package-lock.json', {
        contentType: 'multipart/form-data',
      });
    createdFile = response.body;
  });

  describe('/ (GET)', () => {
    it('should return a list of file', async () => {
      const response = await request(app.getHttpServer()).get('/file');
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  describe('/ (POST)', () => {
    it('should create a file', async () => {
      const filePath = 'C:\\Users\\uhoun\\Projects\\package-lock.json';
      const response = await request(app.getHttpServer())
        .post('/file')
        .attach('file', filePath, { contentType: 'multipart/form-data' });

      expect(response.status).toBe(201);
      expect(response.body).toBeDefined();
    });

    it('should throw NotFoundException when file is undefined', async () => {
      const response = await request(app.getHttpServer())
        .post('/file')
        .send({});
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File is undefined');
    });
  });

  describe('/:id (GET)', () => {
    it('should return a file', async () => {
      const response = await request(app.getHttpServer()).get(
        `/file/${createdFile.id}`,
      );
      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should throw NotFoundException when file is not found', async () => {
      const response = await request(app.getHttpServer()).get(`/file/1`);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File not found');
    });
  });

  describe('/ (PUT)', () => {
    it('should update a file', async () => {
      const filePath =
        'https://unsplash.com/fr/photos/un-objet-bleu-vif-au-milieu-du-ciel-nocturne-Yh85OWKlS0w';
      const response = await request(app.getHttpServer())
        .put('/file')
        .attach('file', filePath)
        .field('file', filePath);

      console.log(response.body);
      expect(response.status).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should throw NotFoundException when file is undefined', async () => {
      const response = await request(app.getHttpServer()).put('/file').send({});
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('File is undefined');
    });
  });
});
