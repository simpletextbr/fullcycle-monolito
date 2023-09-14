import {
  PaymentProcessFacadeInputDto,
  PaymentProcessFacadeOutputDto,
} from "./payment.dto";

export default interface IPaymentFacade {
  save: (
    input: PaymentProcessFacadeInputDto
  ) => Promise<PaymentProcessFacadeOutputDto>;
}
