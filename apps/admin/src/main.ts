
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AdminModule } from './admin.module';
import { join } from 'path';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  const PORT =process.env.PORT_ADMIN || 4000
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Eda Admin API')
    .setDescription('YandexEda uslubidagi API — Banners moduli')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, ()=>
     console.log(`Server is running ${PORT}   ` + `   Swagger is running  ADMIN http://localhost:${PORT}/docs`),
  );
  ;
}
bootstrap();