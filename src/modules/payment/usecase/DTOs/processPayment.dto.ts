export interface ProcessPaymentInputDTO {
  amount: number;
  orderId: string;
}

export interface ProcessPaymentOutputDTO {
  transactionId: string;
  status: string;
  amount: number;
  orderId: string;
  createdAt: Date;
  updatedAt: Date;
}
