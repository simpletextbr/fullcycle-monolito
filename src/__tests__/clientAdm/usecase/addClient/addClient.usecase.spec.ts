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
      name: "John Doe",
      email: "jonhdoe@email.com",
      address: "rua dos bobos, 0",
    };

    const result = await addClientUseCase.execute(input);

    expect(clientRepository.add).toHaveBeenCalled();
    expect(result.id).toBeDefined();
    expect(result.name).toEqual(input.name);
    expect(result.email).toEqual(input.email);
    expect(result.address).toEqual(input.address);
  });
});
