import { INestApplication, InternalServerErrorException } from '@nestjs/common';

const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = process.env.ALLOWED_ORIGINS;
export function setupCors(app: INestApplication) {
  const originList = allowedOrigins?.split(',');

  if (isDevelopment) {
    app.enableCors();
  } else {
    app.enableCors({
      origin: (origin, callback) => {
        if (origin || originList.includes(origin)) {
          callback(null, true);
        } else {
          throw new InternalServerErrorException('Not allowed by CORS');
        }
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });
  }
}