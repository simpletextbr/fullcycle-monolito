import IUsecase from "../../@shared/usecase/IUsecase";
import IPaymentFacade from "./IPayment";
import {
  PaymentProcessFacadeInputDto,
  PaymentProcessFacadeOutputDto,
} from "./payment.dto";

export interface IUsecaseProps {
  processPaymentUseCase: IUsecase;
}

export default class PaymentFacade implements IPaymentFacade {
  private _processPaymentUseCase: IUsecase;

  constructor(usecaseProps: IUsecaseProps) {
    this._processPaymentUseCase = usecaseProps.processPaymentUseCase;
  }

  async save(
    input: PaymentProcessFacadeInputDto
  ): Promise<PaymentProcessFacadeOutputDto> {
    return this._processPaymentUseCase.execute(input);
  }
}
