import Id from "../../@shared/domain/valueObject/id.valueObject";
import Address from "../domain/VOs/Address.vo";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoiceItems.entity";
import IInvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceModel } from "./invoice.model";
import { InvoiceItemsModel } from "./invoiceItems.model";

export default class InvoiceRepository implements IInvoiceGateway {
  async findInvoice(id: string): Promise<Invoice> {
    const invoice = await InvoiceModel.findOne({
      where: { id: id },
      include: [InvoiceItemsModel],
    });

    if (!invoice) {
      throw new Error(`Invoice with id ${id} not found`);
    }

    return new Invoice({
      id: new Id(invoice.id),
      name: invoice.name,
      document: invoice.document,
      address: new Address({
        street: invoice.street,
        number: invoice.number,
        complement: invoice.complement,
        city: invoice.city,
        state: invoice.state,
        zipCode: invoice.zipCode,
      }),
      items: invoice.items.map((item) => {
        return new InvoiceItems({
          id: new Id(item.id),
          name: item.name,
          invoiceId: new Id(invoice.id),
          price: item.price,
        });
      }),
    });
  }

  async generateInvoice(input: Invoice): Promise<Invoice> {
    await InvoiceModel.create(
      {
        id: input.id.id,
        name: input.name,
        document: input.document,
        street: input.address.street,
        number: input.address.number,
        complement: input.address.complement,
        city: input.address.city,
        state: input.address.state,
        zipCode: input.address.zipCode,
        items: input.items.map((item) => {
          return {
            id: item.id.id,
            invoiceId: input.id.id,
            name: item.name,
            price: item.price,
          };
        }),
        total: input.total,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [InvoiceItemsModel] }
    );

    const address = new Address({
      street: input.address.street,
      number: input.address.number,
      complement: input.address.complement,
      city: input.address.city,
      state: input.address.state,
      zipCode: input.address.zipCode,
    });

    const items = input.items.map((item) => {
      return new InvoiceItems({
        id: new Id(item.id.id),
        invoiceId: new Id(item.invoiceId.id),
        name: item.name,
        price: item.price,
      });
    });

    return new Invoice({
      id: input.id,
      name: input.name,
      document: input.document,
      address: address,
      items: items,
    });
  }
}
