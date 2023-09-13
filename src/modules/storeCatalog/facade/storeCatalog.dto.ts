export interface FindStoreCatalogFacadeInputDto {
  id: string;
}

export interface FindStoreCatalogFacadeOutputDto {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
}

type Product = {
  id: string;
  name: string;
  description: string;
  salesPrice: number;
};

export interface FindAllStoreCatalogFacadeDto {
  products: Product[];
}
