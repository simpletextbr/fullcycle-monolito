import { Sequelize } from "sequelize-typescript";
import ClientAdmFacade from "../../../modules/clientAdm/facade/clientAdm.facade";
import { ClientModel } from "../../../modules/clientAdm/repository/client.model";
import ClientRepository from "../../../modules/clientAdm/repository/client.repository";
import AddClientUseCase from "../../../modules/clientAdm/usecase/addClient/addClient.usecase";
import FindClientUseCase from "../../../modules/clientAdm/usecase/findClient/findClient.usecase";

describe("Client Adm facade teste", () => {
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

  it("should create a client with facade", async () => {
    const clientRepository = new ClientRepository();
    const usecase = new AddClientUseCase(clientRepository);
    const facade = new ClientAdmFacade({
      addClientUseCase: usecase,
      findClientUseCase: null,
    });

    const input = {
      id: "1",
      name: "Client 1",
      email: "client@email.com",
      address: "Address 1",
    };

    await facade.addClient(input);

    const result = await ClientModel.findOne({ where: { id: input.id } });

    expect(result.toJSON()).toStrictEqual({
      id: input.id,
      name: input.name,
      email: input.email,
      address: input.address,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should find a client with facade", async () => {
    const clientRepository = new ClientRepository();
    const usecase = new FindClientUseCase(clientRepository);
    const facade = new ClientAdmFacade({
      addClientUseCase: null,
      findClientUseCase: usecase,
    });

    const input = {
      id: "1",
    };

    await ClientModel.create({
      id: input.id,
      name: "Client 1",
      email: "email@email.com",
      address: "Address 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await facade.findClient(input);

    expect(result.id).toBe(input.id);
    expect(result.name).toBe("Client 1");
    expect(result.email).toBe("email@email.com");
    expect(result.address).toBe("Address 1");
  });
});
