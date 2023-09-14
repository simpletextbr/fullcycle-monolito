import { Sequelize } from "sequelize-typescript";
import Id from "../../../modules/@shared/domain/valueObject/id.valueObject";
import Payment from "../../../modules/payment/domain/payment.entity";
import PaymentModel from "../../../modules/payment/repository/payment.model";
import PaymentRepository from "../../../modules/payment/repository/payment.repository";

describe("Payment Repository test", () => {
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

  it("should save a payment with Repository", async () => {
    const paymentRepository = new PaymentRepository();
    const payment = new Payment({
      id: new Id("1"),
      orderId: "1",
      amount: 100,
    });

    payment.approve();

    const result = await paymentRepository.save(payment);

    expect(result.id.id).toBe("1");
    expect(result.orderId).toBe(payment.orderId);
    expect(result.amount).toBe(payment.amount);
    expect(result.status).toBe("approved");
  });
});
