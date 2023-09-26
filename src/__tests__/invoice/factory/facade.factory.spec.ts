import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import InvoiceItems from "../../../modules/invoice/domain/invoiceItems.entity";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/facade.factory";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemsModel } from "../../../modules/invoice/repository/invoiceItems.model";

describe("Invoice Facade test", () => {
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

  const address = {
    street: "Rua 1",
    number: "123",
    complement: "Complemento 1",
    city: "Cidade 1",
    state: "Estado 1",
    zipCode: "12345678",
  };

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

  it("should generate an invoice with Facade", async () => {
    const invoiceFactory = InvoiceFacadeFactory;
    const facade = invoiceFactory.create();

    const input = {
      id: "1",
      name: "Nome 1",
      document: "123456789",
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      items: items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
        invoiceId: item.invoiceId.id,
      })),
    };

    await facade.generateInvoice(input);
    const result = await InvoiceModel.findOne({
      where: { id: "1" },
      include: [InvoiceItemsModel],
    });
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual(input.items[0].id);
    expect(result.items[0].name).toEqual(input.items[0].name);
    expect(result.items[0].price).toEqual(input.items[0].price);
    expect(result.items[1].id).toEqual(input.items[1].id);
    expect(result.items[1].name).toEqual(input.items[1].name);
    expect(result.items[1].price).toEqual(input.items[1].price);
  });

  it("should find an invoice with Facade", async () => {
    const invoiceFactory = InvoiceFacadeFactory;
    const facade = invoiceFactory.create();

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

    const result = await facade.findInvoice(input);

    expect(result.id).toBeDefined();
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.street).toEqual(invoice.street);
    expect(result.number).toEqual(invoice.number);
    expect(result.complement).toEqual(invoice.complement);
    expect(result.city).toEqual(invoice.city);
    expect(result.state).toEqual(invoice.state);
    expect(result.zipCode).toEqual(invoice.zipCode);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].id).toEqual(invoice.items[0].id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.items[1].id).toEqual(invoice.items[1].id);
    expect(result.items[1].name).toEqual(invoice.items[1].name);
    expect(result.items[1].price).toEqual(invoice.items[1].price);
  });
});
