export default interface IUsecase {
  execute: (input: any) => Promise<any>;
}
