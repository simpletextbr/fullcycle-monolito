type InvoiceItem = {
  id?: string;
  name: string;
  price: number;
  invoiceId: string;
};

export interface FindInvoiceFacadeInputDTO {
  id: string;
}

export interface FindInvoiceFacadeOutputDTO {
  id: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  items: InvoiceItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GenerateInvoiceFacadeInputDto {
  id?: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  items: InvoiceItem[];
}

export interface GenerateInvoiceFacadeOutputDto {
  id: string;
  name: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
  items: InvoiceItem[];
  total: number;
}
