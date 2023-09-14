import PaymentFacade from "../facade/payment.facade";
import PaymentRepository from "../repository/payment.repository";
import ProcessPaymentUseCase from "../usecase/processPayment/processPayment.usecase";

export default class PaymentFacadeFactory {
  static create() {
    const paymentRepository = new PaymentRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const facade = new PaymentFacade({
      processPaymentUseCase: usecase,
    });

    return facade;
  }
}
