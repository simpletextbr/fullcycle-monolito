import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import Address from "../../../../modules/invoice/domain/VOs/Address.vo";
import Invoice from "../../../../modules/invoice/domain/invoice.entity";
import InvoiceItems from "../../../../modules/invoice/domain/invoiceItems.entity";
import GenerateInvoiceUseCase from "../../../../modules/invoice/usecase/generateInvoice/generateInvoice.usecase";

const invoiceId = new Id("1");

const invoiceItem = new InvoiceItems({
  name: "Item 1",
  price: 10,
  invoiceId,
});

const invoiceItem2 = new InvoiceItems({
  name: "Item 2",
  price: 20,
  invoiceId,
});

const invoice = new Invoice({
  id: invoiceId,
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
  items: [invoiceItem, invoiceItem2],
});

const invoiceRepositoryMock = () => {
  return {
    generateInvoice: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    findInvoice: jest.fn(),
  };
};

describe("Generate invoice usecase unit Test", () => {
  it("should generate invoice", async () => {
    const invoiceRepository = invoiceRepositoryMock();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );

    const input = {
      name: "Nome 1",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Complemento 1",
      city: "Cidade 1",
      state: "Estado 1",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Item 1",
          price: 10,
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
        },
      ],
    };

    const result = await generateInvoiceUseCase.execute(input);

    expect(invoiceRepository.generateInvoice).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.document).toBe(input.document);
    expect(result.street).toBe(input.street);
    expect(result.number).toBe(input.number);
    expect(result.complement).toBe(input.complement);
    expect(result.city).toBe(input.city);
    expect(result.state).toBe(input.state);
    expect(result.zipCode).toBe(input.zipCode);
    expect(result.items).toHaveLength(2);
  });
});
