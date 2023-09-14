export interface PaymentProcessFacadeInputDto {
  orderId: string;
  amount: number;
}

export interface PaymentProcessFacadeOutputDto {
  transactionId: string;
  status: string;
  amount: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}
