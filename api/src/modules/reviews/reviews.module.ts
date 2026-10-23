import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectDataSource, InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator';
import { paginate, PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrderItem } from '../orders/entities/order-item.entity';
import { OrderStatus } from '../orders/entities/order.entity';
import { Product } from '../products/product.entity';
import { Review } from './review.entity';

export class UpsertReviewDto {
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}

const PURCHASED_STATUSES = [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED];

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  async findByProduct(productId: number, query: PaginationDto) {
    const [rows, total] = await this.reviews.findAndCount({
      where: { productId },
      relations: { user: true },
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    // Solo exponemos el nombre del autor, no sus datos de contacto.
    const data = rows.map(({ user, ...review }) => ({ ...review, author: user.name.split(' ')[0] }));
    return paginate(data, total, query);
  }

  /** Una reseña por usuario y producto: si ya existe, se actualiza. */
  async upsert(userId: number, productId: number, dto: UpsertReviewDto) {
    return this.dataSource.transaction(async (manager) => {
      if (!(await manager.exists(Product, { where: { id: productId } }))) {
        throw new NotFoundException('Producto no encontrado');
      }
      await manager.upsert(Review, { userId, productId, rating: dto.rating, comment: dto.comment ?? '' }, [
        'userId',
        'productId',
      ]);
      await this.refreshRating(manager, productId);
      return manager.findOneByOrFail(Review, { userId, productId });
    });
  }

  async remove(userId: number, productId: number) {
    await this.dataSource.transaction(async (manager) => {
      const { affected } = await manager.delete(Review, { userId, productId });
      if (!affected) throw new NotFoundException('Reseña no encontrada');
      await this.refreshRating(manager, productId);
    });
  }

  /** Indica si el usuario compró el producto (para mostrar "compra verificada"). */
  async hasPurchased(userId: number, productId: number) {
    return this.dataSource
      .getRepository(OrderItem)
      .createQueryBuilder('i')
      .innerJoin('i.order', 'o')
      .where('i.productId = :productId AND o.userId = :userId AND o.status IN (:...statuses)', {
        productId,
        userId,
        statuses: PURCHASED_STATUSES,
      })
      .getExists();
  }

  private async refreshRating(manager: EntityManager, productId: number) {
    const { avg, count } = await manager
      .createQueryBuilder(Review, 'r')
      .select('COALESCE(AVG(r.rating), 0)', 'avg')
      .addSelect('COUNT(*)', 'count')
      .where('r.productId = :productId', { productId })
      .getRawOne();
    await manager.update(Product, { id: productId }, { ratingAvg: Number(Number(avg).toFixed(2)), ratingCount: Number(count) });
  }
}

@ApiTags('reviews')
@Controller('products/:productId/reviews')
export class ReviewsController {
  constructor(private readonly reviews: ReviewsService) {}

  @Get()
  findAll(@Param('productId', ParseIntPipe) productId: number, @Query() query: PaginationDto) {
    return this.reviews.findByProduct(productId, query);
  }

  @Get('eligibility')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async eligibility(@CurrentUser() user: JwtUser, @Param('productId', ParseIntPipe) productId: number) {
    return { verifiedPurchase: await this.reviews.hasPurchased(user.id, productId) };
  }

  @Put()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  upsert(
    @CurrentUser() user: JwtUser,
    @Param('productId', ParseIntPipe) productId: number,
    @Body() dto: UpsertReviewDto,
  ) {
    return this.reviews.upsert(user.id, productId, dto);
  }

  @Delete()
  @HttpCode(204)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@CurrentUser() user: JwtUser, @Param('productId', ParseIntPipe) productId: number) {
    return this.reviews.remove(user.id, productId);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Review])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
