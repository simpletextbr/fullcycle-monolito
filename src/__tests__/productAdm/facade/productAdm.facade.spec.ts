import { Sequelize } from "sequelize-typescript";
import ProductAdmFacade from "../../../modules/productAdm/facade/productAdm.facade";
import ProductModel from "../../../modules/productAdm/repository/product.model";
import ProductRepository from "../../../modules/productAdm/repository/product.repository";
import AddProductUseCase from "../../../modules/productAdm/usecase/add/add.product.usecase";

describe("Product Adm facade teste", () => {
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

  it("should create a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new AddProductUseCase(productRepository);
    const facade = new ProductAdmFacade({
      addProductUseCase: usecase,
      checkStockUseCase: null,
    });

    const input = {
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    await facade.addProduct(input);

    const result = await ProductModel.findOne({ where: { id: input.id } });

    expect(input.id).toEqual(result.id);
    expect(input.name).toBe(result.name);
    expect(input.description).toBe(result.description);
    expect(input.purchasePrice).toBe(result.purchasePrice);
    expect(input.stock).toBe(result.stock);
  });
});
