type InvoiceItem = {
  id: string;
  name: string;
  price: number;
  invoiceId: string;
};

type Address = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export interface FindInvoiceUseCaseInputDTO {
  id: string;
}

export interface FindInvoiceUseCaseOutputDTO {
  id: string;
  name: string;
  document: string;
  address: Address;
  items: InvoiceItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}
