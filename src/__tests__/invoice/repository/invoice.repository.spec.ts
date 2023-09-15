import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Address from "../../../modules/invoice/domain/VOs/Address.vo";
import Invoice from "../../../modules/invoice/domain/invoice.entity";
import InvoiceItems from "../../../modules/invoice/domain/invoiceItems.entity";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import InvoiceRepository from "../../../modules/invoice/repository/invoice.repository";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoiceItems.model";

describe("Invoice Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice with Repository", async () => {
    const invoiceRepository = new InvoiceRepository();

    const address = new Address({
      street: "Rua 1",
      number: "123",
      complement: "Complemento 1",
      city: "Cidade 1",
      state: "Estado 1",
      zipCode: "12345678",
    });

    const items: InvoiceItems[] = [];

    const item01 = new InvoiceItems({
      id: new Id("1"),
      name: "Item 1",
      price: 10,
    });

    items.push(item01);

    const item02 = new InvoiceItems({
      id: new Id("2"),
      name: "Item 2",
      price: 20,
    });

    items.push(item02);

    const input = {
      name: "Nome 1",
      document: "123456789",
      address: address,
      items: items,
    };

    const invoice = new Invoice(input);
    await invoiceRepository.generateInvoice(invoice);

    const result = await InvoiceModel.findOne({ where: { id: invoice.id.id } });
    expect(result.toJSON()).toStrictEqual({
      id: invoice.id.id,
      name: input.name,
      document: input.document,
      address: input.address,
      items: input.items,
    });
  });
});
