import ProductAdmFacade from "../facade/productAdm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add/add.product.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const usecase = new AddProductUseCase(productRepository);
    const facade = new ProductAdmFacade({
      addProductUseCase: usecase,
      checkStockUseCase: null,
    });

    return facade;
  }
}
