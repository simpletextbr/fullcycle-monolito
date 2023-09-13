import { AddProductInputDTO } from "../../../../modules/productAdm/usecase/DTOs/addProduct.dto";
import AddProductUseCase from "../../../../modules/productAdm/usecase/add/addProduct.usecase";

describe("Add product usecase unit Test", () => {
  const productRepositoryMock = () => {
    return {
      add: jest.fn(),
      find: jest.fn(),
    };
  };

  it("should add a product with usecase", async () => {
    const productRepository = productRepositoryMock();
    const usecase = new AddProductUseCase(productRepository);

    const input: AddProductInputDTO = {
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const result = await usecase.execute(input);

    expect(productRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
    expect(result.purchasePrice).toBe(input.purchasePrice);
    expect(result.stock).toBe(input.stock);
  });
});
