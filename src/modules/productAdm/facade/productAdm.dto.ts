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
  productId: string;
  stock: number;
  hasStock: boolean;
}
