import { Timestamp } from '@libs/common/types/timestamp';
import { PointRefundedItem } from '@libs/features/point/domain/calculator/point-refunded-item';

export class PointUsedItem {

  constructor(
    readonly amount: number,
    readonly transactionId: string | null,
    readonly createdAt: Timestamp,
    readonly refundedList: PointRefundedItem[],
  ) {}

  getUsedAmountWithoutRefund() {
    return this.amount - this.getRefundedAmount();
  }

  private getRefundedAmount() {
    return this.refundedList.reduce(
      (
        sum,
        refundedItem,
      ) => sum + refundedItem.amount,
      0,
    );
  }

  static create(
    amount: number,
    transactionId: string | null,
    createdAt: Timestamp,
  ) {
    return new PointUsedItem(
      amount,
      transactionId,
      createdAt,
      [],
    );
  }

  isTransactionBy(transactionId: string) {
    if (!this.transactionId) {
      return false;
    }

    return this.transactionId === transactionId;
  }


  refund(
    param: {
      amount: number;
      transactionId: string,
      current: Timestamp
    },
  ) {
    if (!this.isTransactionBy(param.transactionId)) {
      return 0;
    }

    const refundAmount = this.getRefundableAmountUpTo(param.amount);
    this.addRefundList(refundAmount, param.current);

    return refundAmount;
  }

  private addRefundList(
    refundAmount: number,
    current: Timestamp,
  ) {
    const item = PointRefundedItem.create(
      refundAmount,
      current,
    );

    this.refundedList.push(item);
  }

  private getRefundableAmountUpTo(needAmount: number) {
    const remainingAmount = this.getUsedAmountWithoutRefund();
    return Math.min(remainingAmount, needAmount);
  }

  getRefundableAmount(transactionId: string) {
    if (!this.isTransactionBy(transactionId)) {
      return 0;
    }

    return this.getUsedAmountWithoutRefund();
  }
}
