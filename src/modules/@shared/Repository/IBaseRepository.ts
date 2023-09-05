export default interface IBaseRepository<T> {
  add(entity: T): Promise<void>;
  find(id: string): Promise<T>;
}
