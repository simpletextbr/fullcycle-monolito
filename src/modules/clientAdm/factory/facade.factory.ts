import ClientAdmFacade from "../facade/clientAdm.facade";
import ClientRepository from "../repository/client.repository";
import AddClientUseCase from "../usecase/addClient/addClient.usecase";
import FindClientUseCase from "../usecase/findClient/findClient.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    const addClientUseCase = new AddClientUseCase(clientRepository);
    const findClientUseCase = new FindClientUseCase(clientRepository);
    const facade = new ClientAdmFacade({
      addClientUseCase: addClientUseCase,
      findClientUseCase: findClientUseCase,
    });

    return facade;
  }
}
