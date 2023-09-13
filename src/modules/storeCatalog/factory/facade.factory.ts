import IStoreCatalogFacade from "../facade/IStoreCatalog";
import StoreCatalogFacade from "../facade/storeCatalog.facade";
import ProductRepository from "../repository/product.repository";
import FindAllProductUsecase from "../usecase/findAll/findAll.usecase";
import FindDetailedProductUsecase from "../usecase/findDetailed/findDetailed.usecase";

export default class StoreCatalogFacadeFactory {
  static create(): IStoreCatalogFacade {
    const productRepository = new ProductRepository();
    const findAllUseCase = new FindAllProductUsecase(productRepository);
    const findDetailedUseCase = new FindDetailedProductUsecase(
      productRepository
    );
    const facade = new StoreCatalogFacade({
      findAllUseCase: findAllUseCase,
      findDetailedUseCase: findDetailedUseCase,
    });

    return facade;
  }
}
