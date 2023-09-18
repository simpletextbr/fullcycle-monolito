import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/valueObject/id.valueObject";
import Client from "./client.entity";
import Product from "./product.entity";

type orderProps = {
  id?: Id;
  client: Client;
  products: Product[];
  status: string;
};

export default class Order extends BaseEntity {
  private _client: Client;
  private _products: Product[];
  private _status: string;

  constructor(props: orderProps) {
    super(props.id);
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || "pending";
  }

  approved(): void {
    this._status = "approved";
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  get total(): number {
    return this._products.reduce((acc, product) => acc + product.salesPrice, 0);
  }
}
