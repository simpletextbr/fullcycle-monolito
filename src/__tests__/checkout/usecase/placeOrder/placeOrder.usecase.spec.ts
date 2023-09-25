import { PlaceOrderInputDTO } from "../../../../modules/checkout/usecase/DTOs/placeOrder.dto";
import PlaceOrderUseCase from "../../../../modules/checkout/usecase/placeOrder/placeOrder.usecase";

describe("PlaceOrderUseCase unit test", () => {
  const mockDate = new Date(2000, 1, 1);

  describe("execute method", () => {
    it("should throw an error when client not found", async () => {
      const PlaceOrderFacadeMock = {
        clientFacade: {
          findClient: jest.fn().mockResolvedValue(null),
        },
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);

      //@ts-expect-error - force set client facade
      placeOrderUseCase["_clientFacade"] = PlaceOrderFacadeMock.clientFacade;
      const input: PlaceOrderInputDTO = {
        clientId: "1",
        products: [{ productId: "1" }],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("Client not found")
      );
    });

    it("should throw an error when products aren't valid", async () => {
      const PlaceOrderFacadeMock = {
        clientFacade: {
          findClient: jest.fn().mockResolvedValue(true),
        },
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);

      const validateProductMock = jest
        //@ts-expect-error not return never
        .spyOn(placeOrderUseCase, "validadeProducts")
        //@ts-expect-error not return never
        .mockRejectedValue(new Error("no products selected"));

      //@ts-expect-error - force set client facade
      placeOrderUseCase["_clientFacade"] = PlaceOrderFacadeMock.clientFacade;
      const input: PlaceOrderInputDTO = {
        clientId: "1",
        products: [],
      };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrowError(
        new Error("no products selected")
      );
      expect(validateProductMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it("should throw an error when product not found", async () => {
      const PlaceOrderFacadeMock = {
        clientFacade: {
          findClient: jest.fn().mockResolvedValue(true),
        },
        productFacade: {
          checkStock: jest.fn(({ productId }: { productId: string }) =>
            Promise.resolve({
              productId,
              stock: productId === "1" ? 0 : 1,
              hasStock: productId === "1",
            })
          ),
        },
        storeCatalogFacade: {
          findDetailed: jest.fn().mockResolvedValue(null),
        },
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);

      //@ts-expect-error - force set productFacade
      placeOrderUseCase["_storeCatalogFacade"] =
        PlaceOrderFacadeMock.storeCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
    });
  });

  it("should return a product", async () => {
    const PlaceOrderFacadeMock = {
      clientFacade: {
        findClient: jest.fn().mockResolvedValue(true),
      },
      productFacade: {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
            hasStock: productId === "1",
          })
        ),
      },
      storeCatalogFacade: {
        findDetailed: jest.fn().mockResolvedValue(
          Promise.resolve({
            id: "1",
            description: "teste",
            name: "teste",
            salesPrice: 100,
          })
        ),
      },
    };

    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);

    //@ts-expect-error - force set productFacade
    placeOrderUseCase["_storeCatalogFacade"] =
      PlaceOrderFacadeMock.storeCatalogFacade;

    const result = await placeOrderUseCase["getProduct"]("1");

    expect(result.id.id).toEqual("1");
    expect(result.description).toEqual("teste");
    expect(result.name).toEqual("teste");
    expect(result.salesPrice).toEqual(100);
    expect(
      PlaceOrderFacadeMock.storeCatalogFacade.findDetailed
    ).toHaveBeenCalled();
  });

  describe("validadeProducts method", () => {
    const PlaceOrderFacadeMock = {
      clientFacade: {
        findClient: jest.fn().mockResolvedValue(true),
      },
      productFacade: {
        checkStock: jest.fn(({ productId }: { productId: string }) =>
          Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
            hasStock: productId === "1",
          })
        ),
      },
    };
    //@ts-expect-error - no params in constructor
    const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);
    it("should throw an error if no product are selected", async () => {
      const input: PlaceOrderInputDTO = {
        clientId: "1",
        products: [],
      };

      await expect(
        placeOrderUseCase["validadeProducts"](input)
      ).rejects.toThrowError(new Error("no products selected"));
    });

    it("should throw an error when product is out of stock", async () => {
      //@ts-expect-error - force set productFacade
      placeOrderUseCase["_productFacade"] = PlaceOrderFacadeMock.productFacade;

      let input: PlaceOrderInputDTO = {
        clientId: "1",
        products: [{ productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validadeProducts"](input)
      ).rejects.toThrow("Product 1 is out of stock");

      input = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(
        placeOrderUseCase["validadeProducts"](input)
      ).rejects.toThrowError(new Error("Product 1 is out of stock"));
      expect(
        PlaceOrderFacadeMock.productFacade.checkStock
      ).toHaveBeenCalledTimes(3);

      input = {
        clientId: "1",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(
        placeOrderUseCase["validadeProducts"](input)
      ).rejects.toThrowError(new Error("Product 1 is out of stock"));
      expect(
        PlaceOrderFacadeMock.productFacade.checkStock
      ).toHaveBeenCalledTimes(5);
    });
  });
});
