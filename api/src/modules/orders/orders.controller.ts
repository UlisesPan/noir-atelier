import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CreateOrderDto, OrderQueryDto } from './dto/order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateOrderDto) {
    return this.orders.create(user.id, dto);
  }

  @Get()
  findMine(@CurrentUser() user: JwtUser, @Query() query: OrderQueryDto) {
    return this.orders.findMine(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: JwtUser, @Param('id', ParseIntPipe) id: number) {
    return this.orders.findOne(id, user.id);
  }

  @Post(':id/cancel')
  cancel(@CurrentUser() user: JwtUser, @Param('id', ParseIntPipe) id: number) {
    return this.orders.cancelMine(id, user.id);
  }
}
