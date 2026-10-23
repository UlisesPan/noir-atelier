import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { QueryFailedFilter } from './common/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({
    origin: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',').map((o) => o.trim()),
    credentials: true,
  });
  // Render corre detrás de un proxy: necesario para que el rate limit vea la IP real.
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new QueryFailedFilter());
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Noir Atelier API')
    .setDescription('API REST del e-commerce Noir Atelier: catálogo, carrito, órdenes, pagos y administración.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  SwaggerModule.setup('docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = Number(process.env.PORT ?? 3100);
  await app.listen(port);
  Logger.log(`API lista en http://localhost:${port} — docs en /docs`, 'Bootstrap');
}

bootstrap();
