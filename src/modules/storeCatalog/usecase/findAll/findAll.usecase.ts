import IUsecase from "../../../@shared/usecase/IUsecase";
import Product from "../../domain/product.entity";
import IProductGateway from "../../gateway/product.gateway";
import { FindAllProductsDto } from "../DTOs/findAllProducts.dto";

export default class FindAllProductUsecase implements IUsecase {
  private _productRepository: IProductGateway;

  constructor(productRepository: any) {
    this._productRepository = productRepository;
  }

  async execute(): Promise<FindAllProductsDto> {
    const products = await this._productRepository.findAll();
    return OutputMapper.toDto(products);
  }
}

class OutputMapper {
  static toDto(products: Product[]): FindAllProductsDto {
    return {
      products: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        description: product.description,
        salesPrice: product.salesPrice,
      })),
    };
  }
}
