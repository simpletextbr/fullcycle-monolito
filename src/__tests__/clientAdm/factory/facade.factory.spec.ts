import { Sequelize } from "sequelize-typescript";
import ClientAdmFacadeFactory from "../../../modules/clientAdm/factory/facade.factory";
import { ClientModel } from "../../../modules/clientAdm/repository/client.model";

describe("Product Adm facade factory test", () => {
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

  it("should create a client with factory", async () => {
    const clientFactory = ClientAdmFacadeFactory;
    const facade = clientFactory.create();

    const input = {
      id: "1",
      name: "Client 1",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Complemento 1",
      city: "Cidade 1",
      state: "Estado 1",
      zipCode: "12345678",
    };

    await facade.addClient(input);

    const result = await ClientModel.findOne({ where: { id: input.id } });

    expect(result.toJSON()).toStrictEqual({
      id: input.id,
      name: input.name,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should find a client with factory", async () => {
    const clientFactory = ClientAdmFacadeFactory;
    const facade = clientFactory.create();

    const input = {
      id: "1",
    };

    await ClientModel.create({
      id: input.id,
      name: "Client 1",
      document: "123456789",
      street: "Rua 1",
      number: "123",
      complement: "Complemento 1",
      city: "Cidade 1",
      state: "Estado 1",
      zipCode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await facade.findClient(input);

    expect(result.id).toBe(input.id);
    expect(result.name).toBe("Client 1");
    expect(result.document).toBe("123456789");
    expect(result.street).toBe("Rua 1");
    expect(result.number).toBe("123");
    expect(result.complement).toBe("Complemento 1");
    expect(result.city).toBe("Cidade 1");
    expect(result.state).toBe("Estado 1");
    expect(result.zipCode).toBe("12345678");
  });
});
