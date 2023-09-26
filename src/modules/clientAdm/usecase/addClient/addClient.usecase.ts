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
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement ? input.complement : null,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    };

    const client = new Client(proops);

    await this._clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
