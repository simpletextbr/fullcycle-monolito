import {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.dto";

export default interface IInvoiceFacade {
  generateInvoice: (
    input: GenerateInvoiceFacadeInputDto
  ) => Promise<GenerateInvoiceFacadeOutputDto>;
  findInvoice: (
    input: FindInvoiceFacadeInputDTO
  ) => Promise<FindInvoiceFacadeOutputDTO>;
}
