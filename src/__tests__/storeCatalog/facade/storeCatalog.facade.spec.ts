import { Sequelize } from "sequelize-typescript";
import storeCatalogFacade from "../../../modules/storeCatalog/facade/storeCatalog.facade";
import { ProductModel } from "../../../modules/storeCatalog/repository/product.model";
import ProductRepository from "../../../modules/storeCatalog/repository/product.repository";
import FindAllProductUsecase from "../../../modules/storeCatalog/usecase/findAll/findAll.usecase";
import FindDetailedProductUsecase from "../../../modules/storeCatalog/usecase/findDetailed/findDetailed.usecase";

describe("Store Catalog facade factory test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindDetailedProductUsecase(productRepository);
    const facade = new storeCatalogFacade({
      findAllUseCase: null,
      findDetailedUseCase: usecase,
    });

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 10,
    });

    const product = await facade.findDetailed({ id: "1" });

    expect(product.description).toEqual("Product 1 description");
    expect(product.name).toEqual("Product 1");
    expect(product.salesPrice).toEqual(10);
  });

  it("should list any product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new FindAllProductUsecase(productRepository);
    const facade = new storeCatalogFacade({
      findAllUseCase: usecase,
      findDetailedUseCase: null,
    });

    await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 10,
    });

    await ProductModel.create({
      id: "2",
      name: "Product 2",
      description: "Product 2 description",
      salesPrice: 20,
    });

    const product = await facade.findAll();

    expect(product.products).toHaveLength(2);
    expect(product.products[0].description).toEqual("Product 1 description");
    expect(product.products[0].name).toEqual("Product 1");
    expect(product.products[0].salesPrice).toEqual(10);
    expect(product.products[1].description).toEqual("Product 2 description");
    expect(product.products[1].name).toEqual("Product 2");
    expect(product.products[1].salesPrice).toEqual(20);
  });
});
