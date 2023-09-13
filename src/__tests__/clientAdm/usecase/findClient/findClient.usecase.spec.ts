import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import FindClientUseCase from "../../../../modules/clientAdm/usecase/findClient/findClient.usecase";

const client = {
  id: new Id("123"),
  name: "John Doe",
  email: "johndoe@email.com",
  address: "rua dos bobos, 0",
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
    expect(result.email).toEqual(client.email);
    expect(result.address).toEqual(client.address);
  });
});
