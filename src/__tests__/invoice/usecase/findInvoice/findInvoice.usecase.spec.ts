import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import Address from "../../../../modules/invoice/domain/VOs/Address.vo";
import Invoice from "../../../../modules/invoice/domain/invoice.entity";
import InvoiceItems from "../../../../modules/invoice/domain/invoiceItems.entity";
import FindInvoiceUsecase from "../../../../modules/invoice/usecase/findInvoice/findInvoice.usecase";

const invoiceId = new Id("1");

const invoiceItem = new InvoiceItems({
  id: new Id("1"),
  name: "Item 1",
  price: 10,
  invoiceId,
});

const invoiceItem2 = new InvoiceItems({
  id: new Id("2"),
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
    generateInvoice: jest.fn(),
    findInvoice: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find invoice usecase unit Test", () => {
  it("should find invoice", async () => {
    const invoiceRepository = invoiceRepositoryMock();
    const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository);

    const input = {
      id: "1",
    };

    const result = await findInvoiceUseCase.execute(input);

    expect(invoiceRepository.findInvoice).toBeCalled();
    expect(result).toEqual({
      id: "1",
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
          invoiceId: "1",
        },
        {
          id: "2",
          name: "Item 2",
          price: 20,
          invoiceId: "1",
        },
      ],
      total: 30,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
