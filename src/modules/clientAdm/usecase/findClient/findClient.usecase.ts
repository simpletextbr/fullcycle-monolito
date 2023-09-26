import IClientGateway from "../../gateway/IClient.gateway";
import {
  FindClientInputDTO,
  FindClientOutputDTO,
} from "../DTOs/findClient.dto";

export default class FindClientUseCase {
  private _clientRepository: IClientGateway;

  constructor(clientRepository: IClientGateway) {
    this._clientRepository = clientRepository;
  }

  async execute(input: FindClientInputDTO): Promise<FindClientOutputDTO> {
    const client = await this._clientRepository.find(input.id);

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
