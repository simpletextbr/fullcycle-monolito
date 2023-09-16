import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/valueObject/id.valueObject";

type InvoiceItemsProps = {
  id?: Id;
  name: string;
  price: number;
  invoiceId: Id;
};

export default class InvoiceItems extends BaseEntity {
  private _name: string;
  private _price: number;
  private _invoiceId: Id;

  constructor(props: InvoiceItemsProps) {
    super(props.id);
    this._name = props.name;
    this._price = props.price;
    this._invoiceId = props.id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get invoiceId(): Id {
    return this._invoiceId;
  }
}
