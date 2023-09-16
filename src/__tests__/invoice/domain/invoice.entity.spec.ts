import Address from "../../../modules/invoice/domain/VOs/Address.vo";
import Invoice from "../../../modules/invoice/domain/invoice.entity";
import InvoiceItems from "../../../modules/invoice/domain/invoiceItems.entity";

describe("Invoice Entity test", () => {
  it("should add items to invoice", () => {
    const invoice = new Invoice({
      name: "Nome 1",
      document: "123456789",
      address: new Address({
        street: "Rua 1",
        number: "123",
        complement: "Complemento 1",
        city: "Cidade 1",
        state: "Estado 1",
        zipCode: "12345678",
      }),
      items: [],
    });

    const invoiceItem = new InvoiceItems({
      name: "Item 1",
      price: 10,
      invoiceId: invoice.id,
    });

    invoice.addItems(invoiceItem);
    expect(invoice.items).toEqual([invoiceItem]);
    const invoiceItem2 = new InvoiceItems({
      name: "Item 2",
      price: 20,
      invoiceId: invoice.id,
    });

    invoice.addItems(invoiceItem2);

    expect(invoice.items).toHaveLength(2);
    expect(invoice.items).toEqual([invoiceItem, invoiceItem2]);
  });

  it("should get total of Invoice items", () => {
    const invoice = new Invoice({
      name: "Nome 1",
      document: "123456789",
      address: new Address({
        street: "Rua 1",
        number: "123",
        complement: "Complemento 1",
        city: "Cidade 1",
        state: "Estado 1",
        zipCode: "12345678",
      }),
      items: [],
    });

    const invoiceItem = new InvoiceItems({
      name: "Item 1",
      price: 23,
      invoiceId: invoice.id,
    });

    invoice.addItems(invoiceItem);
    expect(invoice.items).toEqual([invoiceItem]);
    expect(invoice.total()).toBe(23);
    const invoiceItem2 = new InvoiceItems({
      name: "Item 2",
      price: 10,
      invoiceId: invoice.id,
    });

    invoice.addItems(invoiceItem2);

    expect(invoice.items).toHaveLength(2);
    expect(invoice.items).toEqual([invoiceItem, invoiceItem2]);
    expect(invoice.total()).toBe(33);
  });
});
