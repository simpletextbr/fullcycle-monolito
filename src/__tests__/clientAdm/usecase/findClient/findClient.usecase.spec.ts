import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import FindClientUseCase from "../../../../modules/clientAdm/usecase/findClient/findClient.usecase";

const client = {
  id: new Id("1"),
  name: "Client 1",
  document: "123456789",
  street: "Rua 1",
  number: "123",
  complement: "Complemento 1",
  city: "Cidade 1",
  state: "Estado 1",
  zipCode: "12345678",
};

const clientRepositoryMock = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue(Promise.resolve(client)),
  };
};

describe("FindClientUsecase unit test", () => {
  it("should find a client", async () => {
    const clientRepository = clientRepositoryMock();
    const findClientUsecase = new FindClientUseCase(clientRepository);

    const input = {
      id: "123",
    };

    const result = await findClientUsecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(result.id).toEqual(client.id.id);
    expect(result.name).toEqual(client.name);
    expect(result.document).toEqual(client.document);
    expect(result.street).toEqual(client.street);
    expect(result.number).toEqual(client.number);
    expect(result.complement).toEqual(client.complement);
    expect(result.city).toEqual(client.city);
    expect(result.state).toEqual(client.state);
    expect(result.zipCode).toEqual(client.zipCode);
  });
});
