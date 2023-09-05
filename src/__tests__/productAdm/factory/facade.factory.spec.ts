import { Sequelize } from "sequelize-typescript";
import ProductAdmFacadeFactory from "../../../modules/productAdm/factory/facade.factory";
import ProductModel from "../../../modules/productAdm/repository/product.model";

describe("Product Adm facade factory test", () => {
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

  it("should create a product with factory", async () => {
    const productFactory = ProductAdmFacadeFactory;
    const facade = productFactory.create();

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
