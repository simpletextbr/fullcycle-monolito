import Id from "../../@shared/domain/valueObject/id.valueObject";
import Client from "../domain/client.entity";
import IClientGateway from "../gateway/IClient.gateway";
import { ClientModel } from "./client.model";

export default class ClientRepository implements IClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async find(id: string): Promise<Client> {
    const client = await ClientModel.findOne({ where: { id: id } });

    if (!client) {
      throw new Error(`Client with id ${id} not found`);
    }

    const result = new Client({
      id: new Id(client.id),
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
    });

    return result;
  }
}
