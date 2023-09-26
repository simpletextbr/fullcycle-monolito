import Id from "../../../@shared/domain/valueObject/id.valueObject";
import IUsecase from "../../../@shared/usecase/IUsecase";
import Client from "../../../clientAdm/domain/client.entity";
import IClientAdmFacade from "../../../clientAdm/facade/IClientAdm";
import IInvoiceFacade from "../../../invoice/facade/IInvoice";
import IPaymentFacade from "../../../payment/facade/IPayment";
import IProductAdmFacade from "../../../productAdm/facade/IProductAdm";
import Product from "../../../storeCatalog/domain/product.entity";
import IStoreCatalogFacade from "../../../storeCatalog/facade/IStoreCatalog";
import Order from "../../domain/order.entity";
import ICheckoutGateway from "../../gateway/checkout.gateway";
import {
  PlaceOrderInputDTO,
  PlaceOrderOutputDTO,
} from "../DTOs/placeOrder.dto";

export interface PlaceOrderUseCaseProps {
  clientFacade: IClientAdmFacade;
  productAdmFacade: IProductAdmFacade;
  storeCatalogFacade: IStoreCatalogFacade;
  paymentFacade: IPaymentFacade;
  invoiceFacade: IInvoiceFacade;
  repository: ICheckoutGateway;
}

export default class PlaceOrderUseCase implements IUsecase {
  private _clientFacade: IClientAdmFacade;
  private _productAdmFacade: IProductAdmFacade;
  private _storeCatalogFacade: IStoreCatalogFacade;
  private _paymentFacade: IPaymentFacade;
  private _invoiceFacade: IInvoiceFacade;
  private _repository: ICheckoutGateway;

  constructor(PlaceOrderUseCaseProps: PlaceOrderUseCaseProps) {
    this._clientFacade = PlaceOrderUseCaseProps.clientFacade;
    this._productAdmFacade = PlaceOrderUseCaseProps.productAdmFacade;
    this._storeCatalogFacade = PlaceOrderUseCaseProps.storeCatalogFacade;
    this._paymentFacade = PlaceOrderUseCaseProps.paymentFacade;
    this._invoiceFacade = PlaceOrderUseCaseProps.invoiceFacade;
    this._repository = PlaceOrderUseCaseProps.repository;
  }

  async execute(input: PlaceOrderInputDTO): Promise<PlaceOrderOutputDTO> {
    const client = await this._clientFacade.findClient({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }

    await this.validadeProducts(input);

    const products: Product[] = [];

    await Promise.all(
      input.products.map(async (p) => {
        const product = await this.getProduct(p.productId);
        products.push(product);
      })
    );

    const myclient = new Client({
      id: new Id(input.clientId),
      name: client.name,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
    });

    const order = new Order({
      client: myclient,
      products: products,
    });

    const payment = await this._paymentFacade.save({
      orderId: order.id.id,
      amount: order.total,
    });

    const invoiceId = payment.status === "approved" ? new Id() : null;

    const invoice =
      payment.status === "approved"
        ? await this._invoiceFacade.generateInvoice({
            id: invoiceId.id,
            name: myclient.name,
            document: myclient.document,
            street: myclient.street,
            number: myclient.number,
            complement: myclient.complement || null,
            city: myclient.city,
            state: myclient.state,
            zipCode: myclient.zipCode,
            items: products.map((p) => {
              return {
                name: p.name,
                description: p.description,
                price: p.salesPrice,
                invoiceId: invoiceId.id,
              };
            }),
          })
        : null;

    payment.status === "approved" && order.approved();
    this._repository.addOrder(order);

    return {
      id: order.id.id,
      invoiceId: invoiceId?.id || null,
      status: payment.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
          name: p.name,
          description: p.description,
          salesPrice: p.salesPrice,
        };
      }),
    };
  }

  private async validadeProducts(input: PlaceOrderInputDTO): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("no products selected");
    }

    for (const p of input.products) {
      const product = await this._productAdmFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${product.productId} is out of stock`);
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._storeCatalogFacade.findDetailed({
      id: productId,
    });

    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      description: product.description,
      name: product.name,
      salesPrice: product.salesPrice,
    };

    return new Product(productProps);
  }
}
