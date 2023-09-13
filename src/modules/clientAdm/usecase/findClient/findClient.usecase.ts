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
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
