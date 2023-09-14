import Payment from "../../../modules/payment/domain/payment.entity";

describe("Payment Entity Unit Tests", () => {
  it("should create a payment", () => {
    const payment = new Payment({
      amount: 100,
      orderId: "1",
    });

    expect(payment.amount).toBe(100);
    expect(payment.orderId).toBe("1");
    expect(payment.status).toBe("pending");
  });

  it("should validade a payment", () => {
    expect(
      () =>
        new Payment({
          amount: -100,
          orderId: "1",
        })
    ).toThrowError("Amount must be greater than 0");
  });

  it("should approve a payment", () => {
    const payment = new Payment({
      amount: 100,
      orderId: "1",
    });

    payment.process();
    expect(payment.status).toBe("approved");
  });
  it("should decline a payment", () => {
    const payment = new Payment({
      amount: 99,
      orderId: "1",
    });

    payment.process();
    expect(payment.status).toBe("declined");
  });
});
