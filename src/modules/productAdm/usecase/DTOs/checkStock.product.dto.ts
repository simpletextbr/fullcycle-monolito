export interface CheckStockProductInputDTO {
  productId: string;
}

export interface CheckStockProductOutputDTO {
  productId: string;
  stock: number;
  hasStock: boolean;
}
