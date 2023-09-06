import { v4 as uuidv4 } from "uuid";
import ValueObject from "./valueObject.inteface";

export default class Id implements ValueObject {
  private _id: string;

  constructor(value?: string) {
    this._id = value || uuidv4();
  }

  get id(): string {
    return this._id;
  }
}
