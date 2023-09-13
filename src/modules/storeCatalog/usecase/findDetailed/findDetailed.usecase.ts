import IUsecase from "../../../@shared/usecase/IUsecase";
import IProductGateway from "../../gateway/product.gateway";
import {
  FindDetailedInputDto,
  FindDetailedOutputDto,
} from "../DTOs/findDetailed.dto";

export default class FindDetailedProductUsecase implements IUsecase {
  private _productRepository: IProductGateway;

  constructor(productRepository: any) {
    this._productRepository = productRepository;
  }

  async execute(input: FindDetailedInputDto): Promise<FindDetailedOutputDto> {
    const product = await this._productRepository.findDetailed(input.id);

    return {
      id: product.id.id,
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    };
  }
}
