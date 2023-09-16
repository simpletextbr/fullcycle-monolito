import IUsecase from "../../@shared/usecase/IUsecase";
import IInvoiceFacade from "./IInvoice";
import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.dto";

export interface IUsecaseProps {
  generateInvoiceUseCase: IUsecase;
  findInvoiceUseCase: IUsecase;
}

export default class InvoiceFacade implements IInvoiceFacade {
  private _generateInvoiceUseCase: IUsecase;
  private _findInvoiceUseCase: IUsecase;

  constructor(usecaseProps: IUsecaseProps) {
    this._generateInvoiceUseCase = usecaseProps.generateInvoiceUseCase;
    this._findInvoiceUseCase = usecaseProps.findInvoiceUseCase;
  }

  generateInvoice(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }
  findInvoice(
    input: FindInvoiceFacadeInputDTO
  ): Promise<FindInvoiceFacadeOutputDTO> {
    return this._findInvoiceUseCase.execute(input);
  }
}
