import {
  AddClientFacadeInputDto,
  AddClientFacadeOutputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./clientAdm.dto";

export default interface IClientAdmFacade {
  addClient: (
    input: AddClientFacadeInputDto
  ) => Promise<AddClientFacadeOutputDto>;
  findClient: (
    input: FindClientFacadeInputDto
  ) => Promise<FindClientFacadeOutputDto>;
}
