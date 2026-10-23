import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Injectable,
  Module,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, PartialType } from '@nestjs/swagger';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { IsOptional, IsString, Length } from 'class-validator';
import { Repository } from 'typeorm';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { slugify } from '../../common/slugify';
import { Role } from '../users/user.entity';
import { Category } from './category.entity';

export class CreateCategoryDto {
  @IsString()
  @Length(2, 60)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categories: Repository<Category>) {}

  /** Incluye la cantidad de productos activos para mostrar en los filtros. */
  findAll() {
    return this.categories
      .createQueryBuilder('c')
      .loadRelationCountAndMap('c.productCount', 'c.products', 'p', (qb) => qb.where('p.active = true'))
      .orderBy('c.name')
      .getMany();
  }

  create(dto: CreateCategoryDto) {
    return this.categories.save(this.categories.create({ ...dto, slug: slugify(dto.name) }));
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categories.findOneBy({ id });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    this.categories.merge(category, dto);
    if (dto.name) category.slug = slugify(dto.name);
    return this.categories.save(category);
  }

  async remove(id: number) {
    const category = await this.categories.findOne({ where: { id }, relations: { products: true } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    if (category.products.length) throw new ConflictException('La categoría tiene productos asociados');
    await this.categories.remove(category);
  }
}

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateCategoryDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
