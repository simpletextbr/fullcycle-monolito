import IUsecase from "../../@shared/usecase/IUsecase";
import IClientAdmFacade from "./IClientAdm";
import {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./clientAdm.dto";

export interface IUsecaseProps {
  addClientUseCase: IUsecase;
  findClientUseCase: IUsecase;
}

export default class ClientAdmFacade implements IClientAdmFacade {
  private _addClientUseCase: IUsecase;
  private _findClientUseCase: IUsecase;

  constructor(usecaseProps: IUsecaseProps) {
    this._addClientUseCase = usecaseProps.addClientUseCase;
    this._findClientUseCase = usecaseProps.findClientUseCase;
  }

  async addClient(input: AddClientFacadeInputDto): Promise<void> {
    return this._addClientUseCase.execute(input);
  }

  async findClient(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return this._findClientUseCase.execute(input);
  }
}
