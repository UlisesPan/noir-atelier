import { Body, Controller, Get, HttpCode, Module, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentUser, JwtUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Get('mode')
  mode() {
    return { mode: this.payments.mode };
  }

  @Post('checkout/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  checkout(@CurrentUser() user: JwtUser, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.payments.createCheckout(orderId, user.id);
  }

  /** Llamado por el front al volver de Mercado Pago (útil en local, donde el webhook no llega). */
  @Post('confirm/:paymentId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  confirm(@CurrentUser() user: JwtUser, @Param('paymentId') paymentId: string) {
    return this.payments.syncPayment(paymentId, user.id);
  }

  @Post('simulate/:orderId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  simulate(@CurrentUser() user: JwtUser, @Param('orderId', ParseIntPipe) orderId: number) {
    return this.payments.simulatePayment(orderId, user.id);
  }

  @Post('webhook')
  @HttpCode(200)
  @SkipThrottle()
  @ApiExcludeEndpoint()
  async webhook(
    @Query('type') queryType: string | undefined,
    @Query('data.id') queryId: string | undefined,
    @Body() body: { type?: string; data?: { id?: string } },
  ) {
    await this.payments.handleWebhook(body?.type ?? queryType, body?.data?.id ?? queryId);
    return { received: true };
  }
}

@Module({
  imports: [OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
