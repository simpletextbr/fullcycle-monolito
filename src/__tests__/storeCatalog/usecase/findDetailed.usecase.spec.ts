import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../modules/storeCatalog/domain/product.entity";
import FindDetailedProductUsecase from "../../../modules/storeCatalog/usecase/findDetailed/findDetailed.usecase";

const product = new Product({
  id: new Id("1"),
  name: "product 1",
  description: "description 1",
  salesPrice: 10,
});

const productRepositoryMock = () => {
  return {
    findAll: jest.fn(),
    findDetailed: jest.fn().mockResolvedValue(Promise.resolve(product)),
  };
};

describe("findAllProduct usecase unit test", () => {
  it("should return a product", async () => {
    const productRepository = productRepositoryMock();
    const findDetailedProductUsecase = new FindDetailedProductUsecase(
      productRepository
    );
    const filter = {
      id: "1",
    };
    const result = await findDetailedProductUsecase.execute(filter);

    expect(productRepository.findDetailed).toBeCalled();
    expect(result).toEqual({
      id: "1",
      name: "product 1",
      description: "description 1",
      salesPrice: 10,
    });
  });
});
