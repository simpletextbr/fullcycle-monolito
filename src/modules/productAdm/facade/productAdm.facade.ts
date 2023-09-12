import IUsecase from "../../@shared/usecase/IUsecase";
import IProductAdmFacade from "./IProductAdm";
import {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./productAdm.dto";

export interface IUsecaseProps {
  addProductUseCase: IUsecase;
  checkStockUseCase: IUsecase;
}

export default class ProductAdmFacade implements IProductAdmFacade {
  private _addProductUseCase: IUsecase;
  private _checkStockUseCase: IUsecase;

  constructor(usecaseProps: IUsecaseProps) {
    this._addProductUseCase = usecaseProps.addProductUseCase;
    this._checkStockUseCase = usecaseProps.checkStockUseCase;
  }

  async addProduct(input: AddProductFacadeInputDto): Promise<void> {
    return this._addProductUseCase.execute(input);
  }
  async checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
  }
}
