import { Sequelize } from "sequelize-typescript";
import StoreCatalogFacadeFactory from "../../../modules/storeCatalog/factory/facade.factory";
import { ProductModel } from "../../../modules/storeCatalog/repository/product.model";

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
    const storeCatalogFactory = StoreCatalogFacadeFactory;
    const facade = storeCatalogFactory.create();

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
    const storeCatalogFactory = StoreCatalogFacadeFactory;
    const facade = storeCatalogFactory.create();

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

    const products = await facade.findAll();

    expect(products.products).toHaveLength(2);
    expect(products.products[0].description).toEqual("Product 1 description");
    expect(products.products[0].name).toEqual("Product 1");
    expect(products.products[0].salesPrice).toEqual(10);
    expect(products.products[1].description).toEqual("Product 2 description");
    expect(products.products[1].name).toEqual("Product 2");
    expect(products.products[1].salesPrice).toEqual(20);
  });
});
