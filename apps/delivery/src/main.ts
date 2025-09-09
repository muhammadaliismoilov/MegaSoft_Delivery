import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    const PORT =process.env.PORT_USER || 4000
    // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  
    const config = new DocumentBuilder()
      .setTitle('Eda User API')
      .setDescription('Mega Go Eda  API — User moduli')
      .setVersion('1.0.0')
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  
    await app.listen(PORT, ()=>
       console.log(`Server is running ${PORT}   ` + `   Swagger is running USER  http://localhost:${PORT}/docs`),
    );
    ;
}
bootstrap();
