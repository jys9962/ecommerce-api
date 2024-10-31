import { PointItem } from '@libs/features/point/domain/calculator/point-item';
import { Timestamp } from '@libs/common/types/timestamp';
import { Result } from '@libs/common/model/result/result';
import { assertNever } from '@libs/common/util/global-function';
import ExpiredItem = PointCalculator.ExpiredItem;

export class PointCalculator {
  _sortedItems: PointItem[] = [];

  private constructor(
    private readonly items: PointItem[],
  ) {}

  static of(items: PointItem[]) {
    return new PointCalculator(items);
  }

  private getItemsByEarliestExpiration() {
    if (this._sortedItems.length != this.items.length) {
      this._sortedItems = [...this.items].sort(
        (
          t1,
          t2,
        ) => t1.compareByExpiration(t2),
      );
    }

    return this._sortedItems;
  }

  getAmountWhen(current: Timestamp) {
    return this.items
      .filter(
        (item) => !item.isExpiredAt(current),
      )
      .reduce(
        (
          sum,
          item,
        ) => sum + item.getRemainingAmount(),
        0,
      );
  }

  add(
    amount: number,
    expiredAt: Timestamp | null,
    current: Timestamp,
  ) {
    const item = PointItem.create(
      amount,
      expiredAt,
      current,
    );

    this.items.push(item);
  }

  use(
    amount: number,
    transactionId: string | null,
    current: Timestamp,
  ) {
    let needAmount = amount;
    const pointItems = this.getItemsByEarliestExpiration();
    for (let i = 0; i < pointItems.length; i++) {
      const item = pointItems[i];

      const usedAmount = item.use({
        amount: needAmount,
        transactionId: transactionId,
        current: current,
      });

      needAmount -= usedAmount;

      if (needAmount == 0) {
        return Result.ok();
      }
    }

    return assertNever();
  }

  getRefundableAmount(transactionId: string) {
    return this.items.reduce(
      (
        sum,
        item,
      ) => sum + item.getRefundableAmount(transactionId),
      0,
    );

  }

  refund(
    amount: number,
    transactionId: string,
    current: Timestamp,
  ) {
    const items = this.getItemsByEarliestExpiration().reverse();
    let needAmount = amount;
    for (const item of items) {
      const refundedAmount = item.refund({
        amount: needAmount,
        transactionId: transactionId,
        current: current,
      });

      needAmount -= refundedAmount;

      if (needAmount == 0) {
        return Result.ok();
      }
    }

    return assertNever();
  }

  getExpiredList(current: Timestamp): ExpiredItem[] {
    const result: ExpiredItem[] = [];
    for (const pointItem of this.getItemsByEarliestExpiration()) {
      if (!pointItem.isExpiredAt(current)) {
        break;
      }
      if (pointItem.getRemainingAmount() == 0) {
        continue;
      }

      result.push({
        expiredAt: pointItem.expiredAt!,
        remainingAmount: pointItem.getRemainingAmount(),
      });
    }

    return result;
  }
}

export namespace PointCalculator {
  export type ExpiredItem = {
    remainingAmount: number
    expiredAt: Timestamp
  }
}
