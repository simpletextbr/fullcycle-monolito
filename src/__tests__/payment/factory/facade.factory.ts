import { Sequelize } from "sequelize-typescript";
import PaymentFacadeFactory from "../../../modules/payment/factory/facade.factory";
import PaymentModel from "../../../modules/payment/repository/payment.model";

describe("Payment Facade Factory test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([PaymentModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should save an approved payment with factory", async () => {
    const facadeFactory = PaymentFacadeFactory;
    const facade = facadeFactory.create();

    const input = {
      orderId: "1",
      amount: 200,
    };

    await facade.save(input);

    const result = await PaymentModel.findOne({ where: { orderId: "1" } });

    expect(result.toJSON()).toStrictEqual({
      id: expect.any(String),
      orderId: input.orderId,
      amount: input.amount,
      status: "approved",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });

  it("should save a declined payment with factory", async () => {
    const facadeFactory = PaymentFacadeFactory;
    const facade = facadeFactory.create();

    const input = {
      orderId: "1",
      amount: 30,
    };

    await facade.save(input);

    const result = await PaymentModel.findOne({ where: { orderId: "1" } });

    expect(result.toJSON()).toStrictEqual({
      id: expect.any(String),
      orderId: input.orderId,
      amount: input.amount,
      status: "declined",
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
});
