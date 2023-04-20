/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { createProxy } from './xovis-proxy';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,
    { cors: true }
    );
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const port = process.env.PORT || 3333;

  // add proxy routes and config for Xovis IBEX V5
  createProxy(app);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('test')
    .setDescription('API DOCUMENTATION')
    .setVersion('1.0')
    .addTag('stores')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix + '/docs');
  });
}

bootstrap();
