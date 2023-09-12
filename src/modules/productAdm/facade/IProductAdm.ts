import {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./productAdm.dto";

export default interface IProductAdmFacade {
  addProduct: (input: AddProductFacadeInputDto) => Promise<void>;
  checkStock: (
    input: CheckStockFacadeInputDto
  ) => Promise<CheckStockFacadeOutputDto>;
}
