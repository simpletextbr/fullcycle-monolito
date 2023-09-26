import AddClientUseCase from "../../../../modules/clientAdm/usecase/addClient/addClient.usecase";

const clientRepositoryMock = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("AddClientUseCase unit test", () => {
  it("should add a client", async () => {
    const clientRepository = clientRepositoryMock();
    const addClientUseCase = new AddClientUseCase(clientRepository);

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

    const result = await addClientUseCase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.street).toEqual(input.street);
    expect(result.number).toEqual(input.number);
    expect(result.complement).toEqual(input.complement);
    expect(result.city).toEqual(input.city);
    expect(result.state).toEqual(input.state);
    expect(result.zipCode).toEqual(input.zipCode);
  });
});
