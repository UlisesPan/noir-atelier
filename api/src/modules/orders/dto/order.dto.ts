import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Max,
  ValidateNested,
} from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';
import { OrderStatus } from '../entities/order.entity';

export class OrderItemDto {
  @IsInt()
  productId: number;

  @IsInt()
  @IsPositive()
  @Max(10)
  quantity: number;
}

export class CreateOrderDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'La orden debe tener al menos un producto' })
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  /** Si no se envía, se usa la dirección del perfil. */
  @IsOptional()
  @IsString()
  @Length(5, 160)
  shippingAddress?: string;
}

export class OrderQueryDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
