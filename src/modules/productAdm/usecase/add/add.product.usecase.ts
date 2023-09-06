import Id from "../../../@shared/domain/valueObject/id.valueObject";
import Product from "../../domain/product.entity";
import IProductGateway from "../../gateway/IProduct.gateway";
import {
  AddProductInputDTO,
  AddProductOutputDTO,
} from "../DTOs/add.product.dto";

export default class AddProductUseCase {
  private _productRepository: IProductGateway;

  constructor(productGateway: IProductGateway) {
    this._productRepository = productGateway;
  }

  async execute(input: AddProductInputDTO): Promise<AddProductOutputDTO> {
    const props = {
      id: new Id(input.id),
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
    };
    const product = new Product(props);

    await this._productRepository.add(product);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      stock: product.stock,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
}
