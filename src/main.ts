import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const port = config.get<number>('PORT', 3000);
  //const port = process.env.PORT || 3000;

  const swagger = new DocumentBuilder()
    .setTitle('Order Syncer')
    .setVersion('0.1')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('/', app, document);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}`
  );
}

bootstrap();

