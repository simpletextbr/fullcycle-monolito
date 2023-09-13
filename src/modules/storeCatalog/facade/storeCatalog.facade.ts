import IUsecase from "../../@shared/usecase/IUsecase";
import IStoreCatalogFacade from "./IStoreCatalog";
import {
  FindAllStoreCatalogFacadeDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./storeCatalog.dto";

export interface IUsecaseProps {
  findAllUseCase: IUsecase;
  findDetailedUseCase: IUsecase;
}

export default class StoreCatalogFacade implements IStoreCatalogFacade {
  private _findAllUseCase: IUsecase;
  private _findDetailedUseCase: IUsecase;

  constructor(usecaseProps: IUsecaseProps) {
    this._findAllUseCase = usecaseProps.findAllUseCase;
    this._findDetailedUseCase = usecaseProps.findDetailedUseCase;
  }

  async findAll(): Promise<FindAllStoreCatalogFacadeDto> {
    return this._findAllUseCase.execute();
  }

  async findDetailed(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return this._findDetailedUseCase.execute(input);
  }
}
