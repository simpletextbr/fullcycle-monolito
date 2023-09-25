import IUsecase from "../../../@shared/usecase/IUsecase";
import IClientAdmFacade from "../../../clientAdm/facade/IClientAdm";
import IProductAdmFacade from "../../../productAdm/facade/IProductAdm";
import {
  PlaceOrderInputDTO,
  PlaceOrderOutputDTO,
} from "../DTOs/placeOrder.dto";

export interface PlaceOrderUseCaseProps {
  clientFacade: IClientAdmFacade;
  productFacade: IProductAdmFacade;
}

export default class PlaceOrderUseCase implements IUsecase {
  private _clientFacade: IClientAdmFacade;
  private _productFacade: IProductAdmFacade;

  constructor(PlaceOrderUseCaseProps: PlaceOrderUseCaseProps) {
    this._clientFacade = PlaceOrderUseCaseProps.clientFacade;
    this._productFacade = PlaceOrderUseCaseProps.productFacade;
  }

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    const client = await this._clientFacade.findClient({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validadeProducts(input);

    return {
      id: "1",
      invoiceId: "1",
      status: "approved",
      total: 100,
      products: [
        {
          productId: "1",
        },
      ],
    };
  }

  private async validadeProducts(input: PlaceOrderInputDTO): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("no products selected");
    }

    for (const p of input.products) {
      const product = await this._productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${product.productId} is out of stock`);
      }
    }
  }
}
