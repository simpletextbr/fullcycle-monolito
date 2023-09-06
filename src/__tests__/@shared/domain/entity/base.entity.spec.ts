import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../../modules/productAdm/domain/product.entity";

describe("Base Entity test", () => {
  it("should update the updatedAt field", async () => {
    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const product = new Product(input);

    expect(product.updatedAt).toStrictEqual(expect.any(Date));

    product.name = "Product 2";
    product.updatedAt = new Date(2011, 1);

    expect(product.name).toBe("Product 2");
    expect(product.updatedAt).toStrictEqual(new Date(2011, 1));
  });
});
