import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Authentication API')
    .setDescription('API for user authentication')
    .setVersion('1.0')
    .addTag('Auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 9264);
}
bootstrap();
