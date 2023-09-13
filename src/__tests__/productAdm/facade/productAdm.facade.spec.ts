import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import { CheckStockFacadeInputDto } from "../../../modules/productAdm/facade/productAdm.dto";
import ProductAdmFacade from "../../../modules/productAdm/facade/productAdm.facade";
import { ProductModel } from "../../../modules/productAdm/repository/product.model";
import ProductRepository from "../../../modules/productAdm/repository/product.repository";
import AddProductUseCase from "../../../modules/productAdm/usecase/add/addProduct.usecase";
import CheckStockProductUseCase from "../../../modules/productAdm/usecase/checkStock/checkStock.product.usecase";

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

  it("should create a product with facade", async () => {
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

    expect(result.toJSON()).toStrictEqual({
      id: input.id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should check Stock of a product with facade", async () => {
    const productRepository = new ProductRepository();
    const usecase = new CheckStockProductUseCase(productRepository);
    const facade = new ProductAdmFacade({
      addProductUseCase: null,
      checkStockUseCase: usecase,
    });

    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    await ProductModel.create({
      id: input.id.id,
      name: input.name,
      description: input.description,
      purchasePrice: input.purchasePrice,
      stock: input.stock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const filter: CheckStockFacadeInputDto = {
      productId: input.id.id,
    };

    const result = await facade.checkStock(filter);

    expect(result).toStrictEqual({
      productId: input.id.id,
      stock: input.stock,
      hasStock: true,
    });
  });
});
