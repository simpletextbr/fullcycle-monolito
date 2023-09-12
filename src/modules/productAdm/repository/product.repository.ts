import Product from "../domain/product.entity";
import IProductGateway from "../gateway/IProduct.gateway";
import { ProductModel } from "./product.model";

export default class ProductRepository implements IProductGateway {
  async add(product: Product): Promise<void> {
    await ProductModel.create({
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({ where: { id: id } });

    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    return product.toJSON();
  }
}