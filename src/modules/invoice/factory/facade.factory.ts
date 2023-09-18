import IInvoiceFacade from "../facade/IInvoice";
import InvoiceFacade from "../facade/invoice.facade";
import InvoiceRepository from "../repository/invoice.repository";
import FindInvoiceUsecase from "../usecase/findInvoice/findInvoice.usecase";
import GenerateInvoiceUseCase from "../usecase/generateInvoice/generateInvoice.usecase";

export default class InvoiceFacadeFactory {
  static create(): IInvoiceFacade {
    const invoiceRepository = new InvoiceRepository();
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );
    const findInvoiceUseCase = new FindInvoiceUsecase(invoiceRepository);
    const facade = new InvoiceFacade({
      generateInvoiceUseCase,
      findInvoiceUseCase,
    });

    return facade;
  }
}
