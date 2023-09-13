import Product from "../domain/product.entity";

export default interface IProductGateway {
  findAll(): Promise<Product[]>;
  findDetailed(id: string): Promise<Product>;
}
