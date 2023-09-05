import Id from "./id.valueObject";

export default interface ValueObject {
  equals(id: Id): boolean;
}
