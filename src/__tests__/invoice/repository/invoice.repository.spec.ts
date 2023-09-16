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
    invoiceId: new Id("1"),
    price: 10,
  });

  items.push(item01);

  const item02 = new InvoiceItems({
    id: new Id("2"),
    name: "Item 2",
    invoiceId: new Id("1"),
    price: 20,
  });

  items.push(item02);

  it("should generate an invoice with Repository", async () => {
    const invoiceRepository = new InvoiceRepository();

    const input = {
      id: new Id("1"),
      name: "Nome 1",
      document: "123456789",
      address: address,
      items: items,
    };

    const invoice = new Invoice(input);

    await invoiceRepository.generateInvoice(invoice);
    const result = await InvoiceModel.findOne({
      where: { id: input.id.id },
      include: [InvoiceItemsModel],
    });

    expect(result.id).toEqual(input.id.id);
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.address.street);
    expect(result.number).toEqual(input.address.number);
    expect(result.complement).toEqual(input.address.complement);
    expect(result.city).toEqual(input.address.city);
    expect(result.state).toEqual(input.address.state);
    expect(result.zipCode).toEqual(input.address.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual(input.items[0].id.id);
    expect(result.items[0].name).toEqual(input.items[0].name);
    expect(result.items[0].price).toEqual(input.items[0].price);
    expect(result.items[1].id).toEqual(input.items[1].id.id);
    expect(result.items[1].name).toEqual(input.items[1].name);
    expect(result.items[1].price).toEqual(input.items[1].price);
  });

  it("should find an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    const input = {
      id: "1",
    };

    const invoice = await InvoiceModel.create(
      {
        id: "1",
        name: "Nome 1",
        document: "123456789",
        street: address.street,
        number: address.number,
        complement: address.complement,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        items: items.map((item) => {
          return {
            id: item.id.id,
            invoiceId: input.id,
            name: item.name,
            price: item.price,
          };
        }),
        total: 30,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { include: [InvoiceItemsModel] }
    );

    const result = await invoiceRepository.findInvoice(input.id);

    expect(result.id.id).toEqual(invoice.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.street);
    expect(result.address.number).toEqual(invoice.number);
    expect(result.address.complement).toEqual(invoice.complement);
    expect(result.address.city).toEqual(invoice.city);
    expect(result.address.state).toEqual(invoice.state);
    expect(result.address.zipCode).toEqual(invoice.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id.id).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id.id).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });

  it("should not find an invoice", async () => {
    const invoiceRepository = new InvoiceRepository();

    await expect(invoiceRepository.findInvoice("123")).rejects.toThrow(
      "Invoice with id 123 not found"
    );
  });
});
