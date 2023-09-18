import Id from "../../../@shared/domain/valueObject/id.valueObject";
import Address from "../../domain/VOs/Address.vo";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoiceItems.entity";
import IInvoiceGateway from "../../gateway/invoice.gateway";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
  InvoiceItem,
} from "../DTOs/generateInvoice.dto";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: IInvoiceGateway;

  constructor(invoiceGateway: IInvoiceGateway) {
    this._invoiceRepository = invoiceGateway;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const invoiceId = new Id(input.id);

    const address = new Address({
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    });

    let items: InvoiceItems[] = [];

    input.items.forEach((item) => {
      const invoceItem = new InvoiceItems({
        id: new Id(item.id),
        name: item.name,
        invoiceId: invoiceId,
        price: item.price,
      });

      items.push(invoceItem);
    });

    const invoice = new Invoice({
      id: invoiceId,
      name: input.name,
      document: input.document,
      address: address,
      items: items,
    });

    const result = await this._invoiceRepository.generateInvoice(invoice);

    const resultItems: InvoiceItem[] = [];

    result.items.forEach((item) => {
      const invoceItem = {
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: invoiceId.id,
      };

      resultItems.push(invoceItem);
    });

    return {
      id: result.id.id,
      name: result.name,
      document: result.document,
      street: result.address.street,
      number: result.address.number,
      complement: result.address.complement,
      city: result.address.city,
      state: result.address.state,
      zipCode: result.address.zipCode,
      items: resultItems,
      total: result.total(),
    };
  }
}
