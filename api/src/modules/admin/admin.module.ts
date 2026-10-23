import { Body, Controller, Get, Injectable, Module, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OrderQueryDto, UpdateOrderStatusDto } from '../orders/dto/order.dto';
import { OrderStatus } from '../orders/entities/order.entity';
import { OrdersModule } from '../orders/orders.module';
import { OrdersService } from '../orders/orders.service';
import { ProductQueryDto } from '../products/dto/product.dto';
import { ProductsModule } from '../products/products.module';
import { ProductsService } from '../products/products.service';
import { Role } from '../users/user.entity';

const REVENUE_STATUSES = [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

@Injectable()
export class AdminStatsService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async overview() {
    const [totals] = await this.db.query(
      `SELECT
         COALESCE(SUM(total) FILTER (WHERE status = ANY($1)), 0)::float AS revenue,
         COUNT(*) FILTER (WHERE status = ANY($1))::int AS "paidOrders",
         COUNT(*) FILTER (WHERE status = 'pending')::int AS "pendingOrders",
         COALESCE(AVG(total) FILTER (WHERE status = ANY($1)), 0)::float AS "avgTicket"
       FROM orders`,
      [REVENUE_STATUSES],
    );
    const [counts] = await this.db.query(
      `SELECT
         (SELECT COUNT(*) FROM users WHERE role = 'user')::int AS customers,
         (SELECT COUNT(*) FROM products WHERE active)::int AS products,
         (SELECT COUNT(*) FROM products WHERE active AND stock <= 5)::int AS "lowStock"`,
    );

    // Ventas de los últimos 30 días, con días sin ventas en cero para que el gráfico sea continuo.
    const salesByDay = await this.db.query(
      `SELECT to_char(d.day, 'YYYY-MM-DD') AS date,
              COALESCE(SUM(o.total), 0)::float AS revenue,
              COUNT(o.id)::int AS orders
       FROM generate_series(current_date - interval '29 days', current_date, interval '1 day') AS d(day)
       LEFT JOIN orders o ON o."createdAt"::date = d.day AND o.status = ANY($1)
       GROUP BY d.day ORDER BY d.day`,
      [REVENUE_STATUSES],
    );

    const topProducts = await this.db.query(
      `SELECT i."productId" AS id, i."productName" AS name,
              SUM(i.quantity)::int AS units, SUM(i.quantity * i."unitPrice")::float AS revenue
       FROM order_items i JOIN orders o ON o.id = i."orderId"
       WHERE o.status = ANY($1)
       GROUP BY i."productId", i."productName"
       ORDER BY units DESC LIMIT 5`,
      [REVENUE_STATUSES],
    );

    const lowStock = await this.db.query(
      `SELECT id, name, stock, image FROM products WHERE active AND stock <= 5 ORDER BY stock ASC LIMIT 8`,
    );

    return { ...totals, ...counts, salesByDay, topProducts, lowStockProducts: lowStock };
  }
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly stats: AdminStatsService,
    private readonly orders: OrdersService,
    private readonly products: ProductsService,
  ) {}

  @Get('stats')
  overview() {
    return this.stats.overview();
  }

  @Get('orders')
  listOrders(@Query() query: OrderQueryDto) {
    return this.orders.findAll(query);
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto.status);
  }

  @Get('products')
  listProducts(@Query() query: ProductQueryDto) {
    return this.products.findAll(query, true);
  }

  @Get('products/:id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.products.findById(id);
  }
}

@Module({
  imports: [OrdersModule, ProductsModule],
  controllers: [AdminController],
  providers: [AdminStatsService],
})
export class AdminModule {}
