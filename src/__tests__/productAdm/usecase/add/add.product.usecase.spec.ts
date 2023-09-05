import { AddProductInputDTO } from "../../../../modules/productAdm/usecase/DTOs/add.product.dto";

describe("Add product usecase unit Test", () => {
  const productRepositoryMock = () => {
    return {
      add: jest.fn(),
      find: jest.fn(),
    };
  };

  it("should add a product", async () => {
    const productRepository = productRepositoryMock();
    const usecase = new AddProductUseCase(productRepository);

    const input: AddProductInputDTO = {
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    usecase.execute(input);

    expect(productGateway.add).toHaveBeenCalledWith(product);
  });
});
