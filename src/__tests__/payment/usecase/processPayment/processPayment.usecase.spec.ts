import Id from "../../../../modules/@shared/domain/valueObject/id.valueObject";
import Payment from "../../../../modules/payment/domain/payment.entity";
import ProcessPaymentUseCase from "../../../../modules/payment/usecase/processPayment/processPayment.usecase";

const payment = new Payment({
  id: new Id("1"),
  amount: 99,
  orderId: "1",
});

const paymentRepositoryMockDeclined = () => {
  return {
    save: jest.fn().mockResolvedValue(Promise.resolve(payment)),
  };
};

describe("ProcessPaymentUseCase unit Test", () => {
  it("should decline process payment", async () => {
    const paymentGateway = paymentRepositoryMockDeclined();
    const processPaymentUseCase = new ProcessPaymentUseCase(paymentGateway);

    const paymentInput = {
      amount: 99,
      orderId: "1",
    };

    const result = await processPaymentUseCase.execute(paymentInput);

    expect(paymentGateway.save).toBeCalled();
    expect(result.status).toBe("declined");
    expect(result.transactionId).toBe(payment.id.id);
  });

  it("should approve process payment", async () => {
    const paymentGateway = paymentRepositoryMockDeclined();
    const processPaymentUseCase = new ProcessPaymentUseCase(paymentGateway);

    const paymentInput = {
      amount: 100,
      orderId: "1",
    };

    const result = await processPaymentUseCase.execute(paymentInput);

    expect(paymentGateway.save).toBeCalled();
    expect(result.status).toBe("approved");
    expect(result.transactionId).toBe(payment.id.id);
  });
});
