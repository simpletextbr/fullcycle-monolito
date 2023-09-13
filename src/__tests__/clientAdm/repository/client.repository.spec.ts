import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Client from "../../../modules/clientAdm/domain/client.entity";
import { ClientModel } from "../../../modules/clientAdm/repository/client.model";
import ClientRepository from "../../../modules/clientAdm/repository/client.repository";

describe("Client Repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a client with Repository", async () => {
    const clientRepository = new ClientRepository();

    const input = {
      id: new Id("1"),
      name: "Client 1",
      email: "client@email.com",
      address: "rua dos bobos, 0",
    };

    const client = new Client(input);
    await clientRepository.add(client);

    const result = await ClientModel.findOne({ where: { id: client.id.id } });

    expect(result.toJSON()).toStrictEqual({
      id: input.id.id,
      name: input.name,
      email: input.email,
      address: input.address,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should find a client", async () => {
    const clientRepository = new ClientRepository();

    const client = await ClientModel.create({
      id: "123",
      name: "Client 1",
      email: "client@email.com",
      address: "rua dos bobos, 0",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await clientRepository.find("123");

    expect(result.id.id).toEqual(client.id);
    expect(result.name).toEqual(client.name);
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
    expect(result.createdAt).toEqual(client.createdAt);
    expect(result.updatedAt).toEqual(client.updatedAt);
  });

  it("should throw an error when client not found", async () => {
    const clientRepository = new ClientRepository();

    await expect(clientRepository.find("123")).rejects.toThrow(
      "Client with id 123 not found"
    );
  });
});
