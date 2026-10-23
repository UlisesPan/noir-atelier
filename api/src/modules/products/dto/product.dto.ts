import { PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Length,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { Gender } from '../product.entity';

export const PRODUCT_SORTS = ['featured', 'newest', 'price_asc', 'price_desc', 'rating'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

const toBoolean = ({ value }: { value: unknown }) => (value === undefined ? undefined : value === 'true' || value === true);

export class ProductQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  q?: string;

  /** Slug de la categoría. */
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  inStock?: boolean;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsIn(PRODUCT_SORTS)
  sort: ProductSort = 'featured';

  /** Solo admin: incluye productos inactivos. */
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  includeInactive?: boolean;
}

class NotesDto {
  @IsArray()
  @IsString({ each: true })
  top: string[];

  @IsArray()
  @IsString({ each: true })
  heart: string[];

  @IsArray()
  @IsString({ each: true })
  base: string[];
}

export class CreateProductDto {
  @IsString()
  @Length(2, 120)
  name: string;

  @IsString()
  @Length(10, 2000)
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => NotesDto)
  notes?: NotesDto;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  compareAtPrice?: number | null;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  volumeMl?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  /** URL https o ruta relativa a una imagen servida por el front (ej: /products/x.svg). */
  @Matches(/^(https:\/\/\S+|\/[\w\-./]+)$/, { message: 'La imagen debe ser una URL https o una ruta que empiece con /' })
  image: string;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsInt()
  categoryId: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
