import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../modules/storeCatalog/domain/product.entity";
import FindAllProductUsecase from "../../../modules/storeCatalog/usecase/findAllProducts/findAllProducts.usecase";

const product = new Product({
  id: new Id("123"),
  name: "product name",
  description: "product description",
  salesPrice: 10,
});

const product2 = new Product({
  id: new Id("456"),
  name: "product 2",
  description: "product 2",
  salesPrice: 10,
});

const productRepositoryMock = () => {
  return {
    findAll: jest.fn().mockResolvedValue(Promise.resolve([product, product2])),
    findDetailed: jest.fn(),
  };
};

describe("findAllProduct usecase unit test", () => {
  it("should return all products", async () => {
    const productRepository = productRepositoryMock();
    const usecase = new FindAllProductUsecase(productRepository);

    const result = await usecase.execute();

    expect(productRepository.findAll).toHaveBeenCalled();
    expect(result.products.length).toEqual(2);
    expect(result.products[0].id).toEqual(product.id.id);
    expect(result.products[0].name).toEqual(product.name);
    expect(result.products[0].description).toEqual(product.description);
    expect(result.products[0].salesPrice).toEqual(product.salesPrice);
    expect(result.products[1].id).toEqual(product2.id.id);
    expect(result.products[1].name).toEqual(product2.name);
    expect(result.products[1].description).toEqual(product2.description);
    expect(result.products[1].salesPrice).toEqual(product2.salesPrice);
  });
});
