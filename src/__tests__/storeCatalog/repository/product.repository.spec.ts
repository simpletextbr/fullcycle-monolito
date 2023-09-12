import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../../modules/storeCatalog/repository/product.model";
import ProductRepository from "../../../modules/storeCatalog/repository/product.repository";

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

  it("should find all products", async () => {
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

    const productRepository = new ProductRepository();
    const products = await productRepository.findAll();

    expect(products).toHaveLength(2);
    expect(products[0].id.id).toBe("1");
    expect(products[0].name).toBe("Product 1");
    expect(products[0].description).toBe("Product 1 description");
    expect(products[0].salesPrice).toBe(10);
    expect(products[1].id.id).toBe("2");
    expect(products[1].name).toBe("Product 2");
    expect(products[1].description).toBe("Product 2 description");
    expect(products[1].salesPrice).toBe(20);
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();

    await ProductModel.create({
      id: "123",
      name: "Product 1",
      description: "Description 1",
      salesPrice: 10,
    });

    const result = await productRepository.findDetailed("123");

    expect(result.id.id).toBe("123");
    expect(result.name).toBe("Product 1");
    expect(result.description).toBe("Description 1");
    expect(result.salesPrice).toBe(10);
  });

  it("should throw an error when product not found", async () => {
    const productRepository = new ProductRepository();

    await expect(productRepository.findDetailed("123")).rejects.toThrow(
      "Product with id 123 not found"
    );
  });
});
