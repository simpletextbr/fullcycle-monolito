export interface CheckStockProductInputDTO {
  productId: string;
}

export interface CheckStockProductOutputDTO {
  stock: number;
  hasStock: boolean;
}
