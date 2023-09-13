import {
  FindAllStoreCatalogFacadeDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./storeCatalog.dto";

export default interface IStoreCatalogFacade {
  findAll(): Promise<FindAllStoreCatalogFacadeDto>;
  findDetailed(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto>;
}
