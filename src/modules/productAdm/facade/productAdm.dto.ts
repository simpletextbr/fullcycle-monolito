export interface IAddProductFacadeInputDto {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}

export interface ICheckStockFacadeInputDto {
  productId: string;
}

export interface ICheckStockFacadeOutputDto {
  stock: number;
  hasStock: boolean;
}
