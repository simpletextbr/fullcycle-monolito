import Payment from "../domain/payment.entity";

export default interface IPaymentGateway {
  save(input: Payment): Promise<Payment>;
}
