import Id from "../../../@shared/domain/valueObject/id.valueObject";
import Client from "../../domain/client.entity";
import IClientGateway from "../../gateway/IClient.gateway";
import { AddClientInputDTO, AddClientOutputDTO } from "../DTOs/addClient.dto";

export default class AddClientUseCase {
  private _clientRepository: IClientGateway;

  constructor(clientRepository: IClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: AddClientInputDTO): Promise<AddClientOutputDTO> {
    const proops = {
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      address: input.address,
    };

    const client = new Client(proops);

    await this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
