import IUsecase from "../../../@shared/usecase/IUsecase";
import Payment from "../../domain/payment.entity";
import IPaymentGateway from "../../gateway/payment.gateway";
import {
  ProcessPaymentInputDTO,
  ProcessPaymentOutputDTO,
} from "../DTOs/processPayment.dto";

export default class ProcessPaymentUseCase implements IUsecase {
  private paymentGateway: IPaymentGateway;

  constructor(paymentGateway: IPaymentGateway) {
    this.paymentGateway = paymentGateway;
  }

  async execute(
    input: ProcessPaymentInputDTO
  ): Promise<ProcessPaymentOutputDTO> {
    const payment = new Payment({
      amount: input.amount,
      orderId: input.orderId,
    });

    payment.process();

    const savePayment = await this.paymentGateway.save(payment);

    return {
      transactionId: savePayment.id.id,
      status: payment.status,
      amount: savePayment.amount,
      orderId: savePayment.orderId,
      createdAt: savePayment.createdAt,
      updatedAt: savePayment.updatedAt,
    };
  }
}
