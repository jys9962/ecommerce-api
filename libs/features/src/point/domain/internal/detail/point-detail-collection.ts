import { PointDetail } from '@libs/features/point/domain/internal/detail/point-detail';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';

export class PointCalculator {
  constructor(
    public list: PointDetail[],
  ) {}

  getBalance(): PointAmount {
    const amount = this.list.reduce(
      (
        acc,
        t,
      ) => acc + t.signedAmount,
      0,
    );

    return PointAmount.of(amount);
  }

  getBalanceByAddedDetailId(addedDetailId: string) {
    const balance = this.list
      .filter(t => t.addedDetail.id === addedDetailId)
      .reduce(
        (
          sum,
          t,
        ) => sum + t.signedAmount,
        0,
      );

    return PointAmount.of(balance);
  }

  getUsedBalance(transactionId: string): PointAmount {
    const usedAmount = this.list
      .filter(t => t.transactionId === transactionId)
      .reduce(
        (
          usedAmount,
          t,
        ) => usedAmount + t.signedAmount,
        0,
      );

    return PointAmount.of(usedAmount);
  }

  getTransactionAmountByAddedId(
    transactionId: string,
    addedDetailId: string,
  ) {
    const balance = this.list
      .filter(
        t => t.addedDetail.id === addedDetailId &&
             t.transactionId === transactionId,
      )
      .reduce(
        (
          sum,
          t,
        ) => sum + t.signedAmount,
        0,
      );

    return PointAmount.of(balance);
  }
}
