import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Payment, Preference } from 'mercadopago';
import { OrderStatus } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';

export type CheckoutMode = 'mercadopago' | 'simulated';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly client: MercadoPagoConfig | null;

  constructor(
    private readonly config: ConfigService,
    private readonly orders: OrdersService,
  ) {
    const accessToken = config.get<string>('MP_ACCESS_TOKEN');
    // Sin token, la tienda funciona en "modo demo" con pago simulado.
    this.client = accessToken ? new MercadoPagoConfig({ accessToken }) : null;
  }

  get mode(): CheckoutMode {
    return this.client ? 'mercadopago' : 'simulated';
  }

  /** Crea la preferencia de Checkout Pro y devuelve la URL a la que redirigir al comprador. */
  async createCheckout(orderId: number, userId: number) {
    const order = await this.orders.findOne(orderId, userId);
    if (order.status !== OrderStatus.PENDING) throw new BadRequestException('La orden ya no está pendiente de pago');

    const frontendUrl = this.config.getOrThrow<string>('FRONTEND_URL');
    if (!this.client) return { mode: this.mode, url: `${frontendUrl}/checkout/simulate?order=${order.id}` };

    const apiUrl = this.config.get<string>('API_PUBLIC_URL');
    const returnUrl = `${frontendUrl}/checkout/result?order=${order.id}`;
    const preference = await new Preference(this.client).create({
      body: {
        external_reference: String(order.id),
        items: order.items.map((item) => ({
          id: String(item.productId),
          title: item.productName,
          picture_url: item.productImage.startsWith('/') ? `${frontendUrl}${item.productImage}` : item.productImage,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          currency_id: 'ARS',
        })),
        back_urls: { success: returnUrl, pending: returnUrl, failure: returnUrl },
        // Mercado Pago solo acepta auto_return con URLs https.
        ...(frontendUrl.startsWith('https') && { auto_return: 'approved' }),
        ...(apiUrl && { notification_url: `${apiUrl}/payments/webhook` }),
        statement_descriptor: 'NOIR ATELIER',
      },
    });

    await this.orders.updateStatus(order.id, OrderStatus.PENDING, { paymentPreferenceId: preference.id ?? null });
    return { mode: this.mode, url: preference.init_point! };
  }

  /**
   * Sincroniza el estado de un pago consultándolo a Mercado Pago.
   * Nunca confiamos en los datos del webhook o de la URL de retorno: siempre se re-consulta.
   */
  async syncPayment(paymentId: string, userId?: number) {
    if (!this.client) throw new BadRequestException('Mercado Pago no está configurado');

    const payment = await new Payment(this.client).get({ id: paymentId });
    const orderId = Number(payment.external_reference);
    if (!orderId) return null;

    const order = await this.orders.findOne(orderId);
    if (userId !== undefined && order.userId !== userId) throw new ForbiddenException();

    if (payment.status === 'approved' && order.status === OrderStatus.PENDING) {
      return this.orders.updateStatus(orderId, OrderStatus.PAID, { paymentId: String(payment.id) });
    }
    if ((payment.status === 'rejected' || payment.status === 'cancelled') && order.status === OrderStatus.PENDING) {
      this.logger.log(`Pago ${payment.id} ${payment.status} para la orden ${orderId}`);
    }
    return order;
  }

  /**
   * Reconcilia una orden pendiente buscando sus pagos en Mercado Pago por external_reference.
   * No depende del retorno del navegador ni del webhook (que no llega a localhost).
   */
  async syncOrder(orderId: number, userId: number) {
    const order = await this.orders.findOne(orderId, userId);
    if (!this.client || order.status !== OrderStatus.PENDING) return order;

    const { results = [] } = await new Payment(this.client).search({
      options: { external_reference: String(order.id), sort: 'date_created', criteria: 'desc', limit: 10 },
    });
    const approved = results.find((p) => p.status === 'approved');
    if (!approved) return order;
    return this.orders.updateStatus(order.id, OrderStatus.PAID, { paymentId: String(approved.id) });
  }

  async handleWebhook(type: string | undefined, dataId: string | undefined) {
    if (type !== 'payment' || !dataId) return;
    try {
      await this.syncPayment(dataId);
    } catch (error) {
      this.logger.error(`Error procesando webhook del pago ${dataId}`, error);
    }
  }

  /** Solo disponible en modo demo: aprueba la orden como si el pago hubiera sido exitoso. */
  async simulatePayment(orderId: number, userId: number) {
    if (this.client) throw new ForbiddenException('El pago simulado está deshabilitado con Mercado Pago activo');
    await this.orders.findOne(orderId, userId);
    return this.orders.updateStatus(orderId, OrderStatus.PAID, { paymentId: `SIM-${Date.now()}` });
  }
}
