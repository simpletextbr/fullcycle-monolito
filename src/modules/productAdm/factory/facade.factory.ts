import ProductAdmFacade from "../facade/productAdm.facade";
import ProductRepository from "../repository/product.repository";
import AddProductUseCase from "../usecase/add/add.product.usecase";
import CheckStockProductUseCase from "../usecase/checkStock/checkStock.product.usecase";

export default class ProductAdmFacadeFactory {
  static create() {
    const productRepository = new ProductRepository();
    const addProductUsecase = new AddProductUseCase(productRepository);
    const checkStockUsecase = new CheckStockProductUseCase(productRepository);
    const facade = new ProductAdmFacade({
      addProductUseCase: addProductUsecase,
      checkStockUseCase: checkStockUsecase,
    });

    return facade;
  }
}
