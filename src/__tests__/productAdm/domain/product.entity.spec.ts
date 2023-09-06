import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Product from "../../../modules/productAdm/domain/product.entity";

describe("Product Entity test", () => {
  it("should set description of an procutd", () => {
    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const product = new Product(input);
    expect(product.description).toBe("Description 1");

    product.description = "Description 2";
    expect(product.description).toBe("Description 2");
  });

  it("should set purchasePrice of an procutd", () => {
    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const product = new Product(input);
    expect(product.purchasePrice).toBe(10);

    product.purchasePrice = 200;
    expect(product.purchasePrice).toBe(200);
  });

  it("should set stock of an procutd", () => {
    const input = {
      id: new Id("1"),
      name: "Product 1",
      description: "Description 1",
      purchasePrice: 10,
      stock: 10,
    };

    const product = new Product(input);
    expect(product.stock).toBe(10);

    product.stock = 30;
    expect(product.stock).toBe(30);
  });
});
