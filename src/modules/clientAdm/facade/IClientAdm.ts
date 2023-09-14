import {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./clientAdm.dto";

export default interface IClientAdmFacade {
  addClient: (input: AddClientFacadeInputDto) => Promise<void>;
  findClient: (
    input: FindClientFacadeInputDto
  ) => Promise<FindClientFacadeOutputDto>;
}
