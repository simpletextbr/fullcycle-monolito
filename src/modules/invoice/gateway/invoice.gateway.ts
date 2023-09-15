import Invoice from "../domain/invoice.entity";

export default interface IInvoiceGateway {
  findInvoice(id: string): Promise<Invoice>;
  generateInvoice(input: Invoice): Promise<Invoice>;
}
