import IInvoiceGateway from "../../gateway/invoice.gateway";
import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../DTOs/findInvoice.dto";

export default class FindInvoiceUsecase {
  private _invoiceRepository: IInvoiceGateway;

  constructor(invoiceGateway: IInvoiceGateway) {
    this._invoiceRepository = invoiceGateway;
  }

  async execute(
    input: FindInvoiceUseCaseInputDTO
  ): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this._invoiceRepository.findInvoice(input.id);

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
          invoiceId: invoice.id.id,
        };
      }),
      total: invoice.total(),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }
}
