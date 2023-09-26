import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import { PlaceOrderInputDTO } from "../../../../modules/checkout/usecase/DTOs/placeOrder.dto";
import PlaceOrderUseCase from "../../../../modules/checkout/usecase/placeOrder/placeOrder.usecase";
import Product from "../../../../modules/storeCatalog/domain/product.entity";

describe("PlaceOrderUseCase unit test", () => {
  const mockDate = new Date(2000, 1, 1);

  describe("execute method", () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

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

    describe("place an order", () => {
      const clientProps = {
        id: "1c",
        name: "teste",
        document: "123",
        street: "teste",
        number: "123",
        complement: "teste",
        city: "teste",
        state: "teste",
        zipCode: "123",
      };

      const PlaceOrderFacadeMock = {
        clientFacade: {
          findClient: jest.fn().mockResolvedValue(clientProps),
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
          findDetailed: jest
            .fn()
            .mockResolvedValue(Promise.resolve(clientProps)),
        },
        paymentFacade: {
          save: jest.fn().mockResolvedValue({
            trasactionId: "1t",
            orderId: "1o",
            amount: 100,
            status: "error",
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        },
        invoiceFacade: {
          generateInvoice: jest
            .fn()
            .mockResolvedValue(Promise.resolve({ id: "1i" })),
        },
        repository: {
          addOrder: jest.fn(),
        },
      };

      //@ts-expect-error - no params in constructor
      const placeOrderUseCase = new PlaceOrderUseCase(PlaceOrderFacadeMock);

      const productsMock = {
        "1": new Product({
          id: new Id("1"),
          description: "teste",
          name: "teste",
          salesPrice: 100,
        }),
        "2": new Product({
          id: new Id("2"),
          description: "teste",
          name: "teste",
          salesPrice: 100,
        }),
      };

      const mockValidateProducts = jest
        //@ts-expect-error not return never
        .spyOn(placeOrderUseCase, "validadeProducts")
        //@ts-expect-error not return never
        .mockResolvedValue(null);

      const mockGetProduct = jest
        //@ts-expect-error not return never
        .spyOn(placeOrderUseCase, "getProduct")
        //@ts-expect-error not return never
        .mockImplementation((productId: keyof typeof productsMock) => {
          return productsMock[productId];
        });

      it("should order not be approved", async () => {
        //@ts-expect-error - force set repository
        placeOrderUseCase["_repository"] = PlaceOrderFacadeMock.repository;

        const input: PlaceOrderInputDTO = {
          clientId: clientProps.id,
          products: [{ productId: "1" }, { productId: "2" }],
        };

        const result = await placeOrderUseCase.execute(input);

        expect(result.invoiceId).toBeNull();
        expect(result.status).toEqual("error");
        expect(result.total).toEqual(200);
        expect(result.products).toStrictEqual([
          {
            productId: "1",
            description: "teste",
            name: "teste",
            salesPrice: 100,
          },
          {
            productId: "2",
            description: "teste",
            name: "teste",
            salesPrice: 100,
          },
        ]);
        expect(
          placeOrderUseCase["_clientFacade"].findClient
        ).toHaveBeenCalledTimes(1);
        expect(
          placeOrderUseCase["_clientFacade"].findClient
        ).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(placeOrderUseCase["_paymentFacade"].save).toHaveBeenCalledTimes(
          1
        );
        expect(placeOrderUseCase["_repository"].addOrder).toHaveBeenCalledTimes(
          1
        );
        expect(placeOrderUseCase["_paymentFacade"].save).toHaveBeenCalledWith({
          orderId: result.id,
          amount: result.total,
        });
        expect(
          placeOrderUseCase["_invoiceFacade"].generateInvoice
        ).toHaveBeenCalledTimes(0);
      });

      it("should order be approved", async () => {
        placeOrderUseCase["_paymentFacade"] = {
          save: jest.fn().mockResolvedValue({
            trasactionId: "1t",
            orderId: "1o",
            amount: 100,
            status: "approved",
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        };

        //@ts-expect-error - force set repository
        placeOrderUseCase["_repository"] = PlaceOrderFacadeMock.repository;

        const input: PlaceOrderInputDTO = {
          clientId: clientProps.id,
          products: [{ productId: "1" }, { productId: "2" }],
        };

        const result = await placeOrderUseCase.execute(input);
        expect(result.invoiceId).toBeDefined();
        expect(result.status).toEqual("approved");
        expect(result.total).toEqual(200);
        expect(result.products).toStrictEqual([
          {
            productId: "1",
            description: "teste",
            name: "teste",
            salesPrice: 100,
          },
          {
            productId: "2",
            description: "teste",
            name: "teste",
            salesPrice: 100,
          },
        ]);
        expect(
          placeOrderUseCase["_clientFacade"].findClient
        ).toHaveBeenCalledTimes(1);
        expect(
          placeOrderUseCase["_clientFacade"].findClient
        ).toHaveBeenCalledWith({ id: "1c" });
        expect(mockValidateProducts).toHaveBeenCalledTimes(1);
        expect(mockValidateProducts).toHaveBeenCalledWith(input);
        expect(mockGetProduct).toHaveBeenCalledTimes(2);
        expect(placeOrderUseCase["_paymentFacade"].save).toHaveBeenCalledTimes(
          1
        );
        expect(placeOrderUseCase["_repository"].addOrder).toHaveBeenCalledTimes(
          1
        );
        expect(placeOrderUseCase["_paymentFacade"].save).toHaveBeenCalledWith({
          orderId: result.id,
          amount: result.total,
        });
        expect(
          placeOrderUseCase["_invoiceFacade"].generateInvoice
        ).toHaveBeenCalledTimes(1);
        expect(
          placeOrderUseCase["_invoiceFacade"].generateInvoice
        ).toHaveBeenCalledWith({
          id: result.invoiceId,
          name: clientProps.name,
          document: clientProps.document,
          street: clientProps.street,
          number: clientProps.number,
          complement: clientProps.complement,
          city: clientProps.city,
          state: clientProps.state,
          zipCode: clientProps.zipCode,
          items: [
            {
              name: productsMock["1"].name,
              price: productsMock["1"].salesPrice,
              description: productsMock["1"].description,
              invoiceId: result.invoiceId,
            },
            {
              name: productsMock["2"].name,
              price: productsMock["2"].salesPrice,
              description: productsMock["2"].description,
              invoiceId: result.invoiceId,
            },
          ],
        });
      });
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

      //@ts-expect-error - force set storeCatalogFacade
      placeOrderUseCase["_storeCatalogFacade"] =
        PlaceOrderFacadeMock.storeCatalogFacade;

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      );
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

      //@ts-expect-error - force set storeCatalogFacade
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
      placeOrderUseCase["_productAdmFacade"] =
        PlaceOrderFacadeMock.productFacade;

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
