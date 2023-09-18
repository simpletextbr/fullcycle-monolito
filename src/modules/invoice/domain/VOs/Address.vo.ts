type AddressProps = {
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
};

export default class Address {
  private _street: string;
  private _number: string;
  private _city: string;
  private _zipCode: string;
  private _complement: string;
  private _state: string;

  constructor(props: AddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._city = props.city;
    this._zipCode = props.zipCode;
    this._complement = props.complement;
    this._state = props.state;
  }

  get street(): string {
    return this._street;
  }

  get number(): string {
    return this._number;
  }

  get city(): string {
    return this._city;
  }

  get zipCode(): string {
    return this._zipCode;
  }

  get complement(): string {
    return this._complement;
  }

  get state(): string {
    return this._state;
  }
}
