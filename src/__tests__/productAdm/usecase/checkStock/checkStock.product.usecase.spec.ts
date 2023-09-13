import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../../modules/productAdm/domain/product.entity";
import CheckStockProductUseCase from "../../../../modules/productAdm/usecase/checkStock/checkStock.product.usecase";

const productMock = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 description",
  purchasePrice: 10,
  stock: 10,
});

const productRepositoryMock = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(productMock)),
  };
};

describe("Check Stock Product Usecase unit test", () => {
  it("should check if have any product stock ", async () => {
    const productRepository = productRepositoryMock();
    const checkStockProductUsecase = new CheckStockProductUseCase(
      productRepository
    );

    const filter = {
      productId: "1",
    };

    const product = await checkStockProductUsecase.execute(filter);

    expect(productRepository.find).toBeCalled();
    expect(product).toStrictEqual({
      productId: productMock.id.id,
      stock: productMock.stock,
      hasStock: true,
    });
  });
});
