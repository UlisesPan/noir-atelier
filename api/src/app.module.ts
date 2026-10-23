import { Controller, Get, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiExcludeController } from '@nestjs/swagger';
import { buildDataSourceOptions } from './config/database.config';
import { validateEnv } from './config/env.validation';
import { AdminModule } from './modules/admin/admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ProductsModule } from './modules/products/products.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { UsersModule } from './modules/users/users.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';

@ApiExcludeController()
@Controller()
class HealthController {
  /** Usado por Render como health check. */
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...buildDataSourceOptions(),
        // En producción las migraciones pendientes se aplican al arrancar.
        migrationsRun: process.env.NODE_ENV === 'production',
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 120 }]),
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
    ReviewsModule,
    WishlistModule,
    AdminModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
