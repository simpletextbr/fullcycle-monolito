import IProductGateway from "../../gateway/IProduct.gateway";
import {
  CheckStockProductInputDTO,
  CheckStockProductOutputDTO,
} from "../DTOs/checkStock.dto";

export default class CheckStockProductUseCase {
  private _productRepository: IProductGateway;

  constructor(productGateway: IProductGateway) {
    this._productRepository = productGateway;
  }

  async execute(
    input: CheckStockProductInputDTO
  ): Promise<CheckStockProductOutputDTO> {
    const product = await this._productRepository.find(input.productId);
    const hasStock = product.stock > 0;
    return {
      productId: product.id.id,
      stock: product.stock,
      hasStock,
    };
  }
}
