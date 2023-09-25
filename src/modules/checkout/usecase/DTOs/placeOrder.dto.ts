type Product = {
  productId: string;
};

export interface PlaceOrderInputDTO {
  clientId: string;
  products: Product[];
}

export interface PlaceOrderOutputDTO {
  id: string;
  invoiceId: string;
  status: string;
  total: number;
  products: Product[];
}
