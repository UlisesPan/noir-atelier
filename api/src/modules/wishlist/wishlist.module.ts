import {
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
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Product } from '../products/product.entity';
import { WishlistItem } from './wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem) private readonly items: Repository<WishlistItem>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  async findAll(userId: number) {
    const items = await this.items.find({
      where: { userId, product: { active: true } },
      relations: { product: { category: true } },
      order: { createdAt: 'DESC' },
    });
    return items.map((i) => i.product);
  }

  async add(userId: number, productId: number) {
    if (!(await this.products.exists({ where: { id: productId, active: true } }))) {
      throw new NotFoundException('Producto no encontrado');
    }
    await this.items.upsert({ userId, productId }, ['userId', 'productId']);
  }

  async remove(userId: number, productId: number) {
    await this.items.delete({ userId, productId });
  }
}

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.wishlist.findAll(user.id);
  }

  @Put(':productId')
  @HttpCode(204)
  add(@CurrentUser() user: JwtUser, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlist.add(user.id, productId);
  }

  @Delete(':productId')
  @HttpCode(204)
  remove(@CurrentUser() user: JwtUser, @Param('productId', ParseIntPipe) productId: number) {
    return this.wishlist.remove(user.id, productId);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItem, Product])],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
