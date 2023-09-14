import Payment from "../domain/payment.entity";
import IPaymentGateway from "../gateway/payment.gateway";
import PaymentModel from "./payment.model";

export default class PaymentRepository implements IPaymentGateway {
  async save(input: Payment): Promise<Payment> {
    await PaymentModel.create({
      id: input.id.id,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });

    return new Payment({
      id: input.id,
      orderId: input.orderId,
      amount: input.amount,
      status: input.status,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt,
    });
  }
}
