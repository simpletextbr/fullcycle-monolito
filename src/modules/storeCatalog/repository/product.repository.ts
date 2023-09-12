import Id from "../../@shared/domain/valueObject/id.valueObject";
import Product from "../domain/product.entity";
import IProductGateway from "../gateway/product.gateway";
import { ProductModel } from "./product.model";

export default class ProductRepository implements IProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();
    return products.map(
      (products) =>
        new Product({
          id: new Id(products.id),
          name: products.name,
          description: products.description,
          salesPrice: products.salesPrice,
        })
    );
  }
  async findDetailed(id: string): Promise<Product> {
    const product = await ProductModel.findOne({ where: { id: id } });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const result = new Product({
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    });

    return result;
  }
}
