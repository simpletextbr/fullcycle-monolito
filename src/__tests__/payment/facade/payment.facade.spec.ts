import { Sequelize } from "sequelize-typescript";
import PaymentFacade from "../../../modules/payment/facade/payment.facade";
import PaymentModel from "../../../modules/payment/repository/payment.model";
import PaymentRepository from "../../../modules/payment/repository/payment.repository";
import ProcessPaymentUseCase from "../../../modules/payment/usecase/processPayment/processPayment.usecase";

describe("Payment Facade test", () => {
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

  it("should save an approved payment with facade", async () => {
    const paymentRepository = new PaymentRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const facade = new PaymentFacade({
      processPaymentUseCase: usecase,
    });

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

  it("should save a declined payment with facade", async () => {
    const paymentRepository = new PaymentRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const facade = new PaymentFacade({
      processPaymentUseCase: usecase,
    });

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
