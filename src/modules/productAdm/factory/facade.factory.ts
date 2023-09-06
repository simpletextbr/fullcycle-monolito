import ProductAdmFacade from "../facade/productAdm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add/add.product.usecase";
import CheckStockProductUseCase from "../usecase/checkStock/checkStock.product.usecase";

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

  static checkStock() {
    const productRepository = new ProductRepository();
    const usecase = new CheckStockProductUseCase(productRepository);
    const facade = new ProductAdmFacade({
      addProductUseCase: null,
      checkStockUseCase: usecase,
    });

    return facade;
  }
}
