import {
  IAddProductFacadeInputDto,
  ICheckStockFacadeInputDto,
  ICheckStockFacadeOutputDto,
} from "./productAdm.dto";

export default interface IProductAdmFacade {
  addProduct: (input: IAddProductFacadeInputDto) => Promise<void>;
  checkStock: (
    input: ICheckStockFacadeInputDto
  ) => Promise<ICheckStockFacadeOutputDto>;
}
