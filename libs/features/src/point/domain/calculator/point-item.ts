import { Timestamp } from '@libs/common/types/timestamp';
import { PointUsedItem } from '@libs/features/point/domain/calculator/point-used-item';

export class PointItem {

  constructor(
    readonly amount: number,
    readonly expiredAt: Timestamp | null,
    readonly usedList: PointUsedItem[],
    readonly createdAt: Timestamp,
  ) {}

  static create(
    amount: number,
    expiredAt: Timestamp | null,
    current: Timestamp,
  ) {
    return new PointItem(
      amount,
      expiredAt,
      [],
      current,
    );
  }


  isExpiredAt(current: Timestamp) {
    return this.expiredAt
           && current > this.expiredAt;
  }

  getRemainingAmount() {
    return this.amount - this.getUsedAmount();
  }

  private getUsedAmount() {
    return this.usedList.reduce(
      (
        sum,
        usedItem,
      ) => sum + usedItem.getUsedAmountWithoutRefund()
      , 0,
    );
  }

  compareByExpiration(other: PointItem) {
    const thisExpiredAt = this.expiredAt || Number.MAX_SAFE_INTEGER;
    const otherExpiredAt = other.expiredAt || Number.MAX_SAFE_INTEGER;

    return thisExpiredAt - otherExpiredAt
           || (this.createdAt - other.createdAt);
  }

  use(param: {
    amount: number;
    current: Timestamp;
    transactionId: string | null
  }): number {
    if (this.isExpiredAt(param.current)) {
      return 0;
    }

    const usedAmount = this.getUsableAmountUpto(param.amount);
    this.addToUsedList(usedAmount, param.transactionId || null, param.current);
    return usedAmount;
  }

  private addToUsedList(
    usedAmount: number,
    transactionId: string | null,
    current: Timestamp,
  ) {
    this.usedList.push(PointUsedItem.create(
      usedAmount,
      transactionId,
      current,
    ));
  }

  isUsedInTransaction(transactionId: string) {
    return this.usedList.some(
      (usedItem) => usedItem.isTransactionBy(transactionId),
    );
  }

  refund(
    param: {
      amount: number;
      current: Timestamp;
      transactionId: string
    },
  ) {
    if (!this.isUsedInTransaction(param.transactionId)) {
      return 0;
    }

    let needAmount = param.amount;
    let refundedAmount = 0;
    for (const usedItem of this.usedList) {
      const refundedAmountAtTime = usedItem.refund({
        amount: needAmount,
        transactionId: param.transactionId,
        current: param.current,
      });

      needAmount -= refundedAmountAtTime;
      refundedAmount += refundedAmountAtTime;
    }

    return refundedAmount;
  }

  private getUsableAmountUpto(amount: number) {
    const remainingAmount = this.getRemainingAmount();
    return Math.min(
      remainingAmount,
      amount,
    );
  }

  getRefundableAmount(transactionId: string) {
    return this.usedList.reduce(
      (
        sum,
        usedItem,
      ) => sum + usedItem.getRefundableAmount(transactionId),
      0,
    );

  }
}
