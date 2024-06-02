import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from '@app/common';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { RedocModule, RedocOptions } from 'nestjs-redoc';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const config = new DocumentBuilder()
    .setTitle('Blog API')
    .setDescription('The Blog Post API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .setContact('Blog Post', 'mailto:uhoungbo@gmail.com', 'uhoungbo@gmail.com')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      url: '/docs-json',
    },
  };
  SwaggerModule.setup('', app, document, customOptions);

  // Setup ReDoc
  const redocOptions: RedocOptions = {
    title: 'Referral Catch API',
    sortPropsAlphabetically: true,
    hideDownloadButton: false,
    hideHostname: false,
  };
  await RedocModule.setup('/docs', app, document, redocOptions);
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('PORT'));
}
bootstrap().then(() => console.log('Application is running'));
