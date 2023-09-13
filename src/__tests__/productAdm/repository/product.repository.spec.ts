import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../modules/productAdm/domain/product.entity";
import { ProductModel } from "../../../modules/productAdm/repository/product.model";
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

    expect(result.toJSON()).toStrictEqual({
      id: input.id.id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    await ProductModel.create({
      id: "123",
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await productRepository.find("123");

    expect(result.id.id).toBe("123");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description 1");
    expect(result.purchasePrice).toBe(10);
    expect(result.stock).toBe(10);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = new ProductRepository();

    await expect(productRepository.find("123")).rejects.toThrow(
      "Product with id 123 not found"
    );
  });
});
