import { INestApplication, InternalServerErrorException } from '@nestjs/common';

const isDevelopment = process.env.NODE_ENV === 'development';
const allowedOrigins = process.env.ALLOWED_ORIGINS;
export function setupCors(app: INestApplication) {
  const originList = allowedOrigins?.split(',');

  if (isDevelopment) {
    app.enableCors({
      origin: ['http://localhost:3000', 'https://blog-app-front-xi.vercel.app'],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });
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
