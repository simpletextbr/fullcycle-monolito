import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../modules/productAdm/domain/product.entity";
import ProductModel from "../../../modules/productAdm/repository/product.model";
import ProductRepository from "../../../modules/productAdm/repository/product.repository";

describe("Product Repository test", () => {
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

  it("should create a product with Repository", async () => {
    const productRepository = new ProductRepository();

    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const product = new Product(input);
    await productRepository.add(product);

    const result = await ProductModel.findOne({ where: { id: product.id.id } });

    expect(product.id.id).toEqual(result.id);
    expect(product.name).toBe(result.name);
    expect(product.description).toBe(result.description);
    expect(product.purchasePrice).toBe(result.purchasePrice);
    expect(product.stock).toBe(result.stock);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    const productCreated = await ProductModel.create({
      id: "1",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await productRepository.find("1");

    expect(productCreated.id).toEqual(result.id.id);
    expect(productCreated.name).toBe(result.name);
    expect(productCreated.description).toBe(result.description);
    expect(productCreated.purchasePrice).toBe(result.purchasePrice);
    expect(productCreated.stock).toBe(result.stock);
  });
});
