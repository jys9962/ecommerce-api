import { Timestamp } from '@libs/common/types/timestamp';
import { Result } from '@libs/common/model/result/result';
import { RefundPointError, UsePointError } from '@libs/features/point/domain/point.error';
import { PointCalculator } from '@libs/features/point/domain/calculator/point-calculator';
import { PointLog } from '@libs/features/point/domain/point-log';

export class PointAccount {
  private readonly historyList: PointLog[] = [];
  private readonly calculator: PointCalculator = PointCalculator.of([]);

  static create() {
    return new PointAccount();
  }

  get(
    param: PointAccount.GetParam = {
      executedAt: Timestamp.now(),
    },
  ) {
    const current = param.executedAt || Timestamp.now();
    return this.calculator.getAmountWhen(current);
  }

  add(
    param: PointAccount.AddParam,
  ) {
    const current = param.executedAt || Timestamp.now();
    this.syncExpired(current);

    this.calculator.add(
      param.amount,
      param.expiredAt || null,
      current,
    );
    this.historyList.push({
      type: 'ADD',
      amount: param.amount,
      memo: param.memo || '',
      expiredAt: param.expiredAt ? new Date(param.expiredAt) : null,
      createdAt: new Date(current),
    });

    this.syncExpired(current);
  }

  use(
    param: PointAccount.UseParam,
  ): Result<void, UsePointError> {
    const current = param.executedAt || Timestamp.now();
    this.syncExpired(current);

    const currentAmount = this.calculator.getAmountWhen(current);

    if (param.amount > currentAmount) {
      return Result.err<UsePointError>('point_not_enough');
    }

    this.calculator.use(
      param.amount,
      param.transactionId || null,
      current,
    );
    this.historyList.push({
      type: 'USE',
      amount: param.amount,
      transactionId: param.transactionId || null,
      createdAt: new Date(current),
      memo: param.memo || '',
    });

    this.syncExpired(current);
    return Result.ok();
  }

  refund(
    param: PointAccount.RefundParam,
  ): Result<void, RefundPointError> {
    const current = param.executedAt || Timestamp.now();
    this.syncExpired(current);

    const refundableAmount = this.calculator.getRefundableAmount(param.transactionId);
    if (param.amount > refundableAmount) {
      return Result.err<RefundPointError>('not_enough_to_refund');
    }

    this.calculator.refund(
      param.amount,
      param.transactionId,
      current,
    );
    this.historyList.push({
      type: 'REFUND',
      amount: param.amount,
      transactionId: param.transactionId,
      memo: param.memo || '',
      createdAt: new Date(current),
    });

    this.syncExpired(current);
    return Result.ok();
  }

  private syncExpired(
    current: Timestamp,
  ) {
    const expiredList = this.calculator.getExpiredList(current);
    for (const expiredItem of expiredList) {
      this.calculator.use(
        expiredItem.remainingAmount,
        null,
        expiredItem.expiredAt,
      );
      this.historyList.push({
        type: 'EXPIRED',
        amount: expiredItem.remainingAmount,
        createdAt: new Date(expiredItem.expiredAt),
        memo: '',
      });
    }
  }

  getLogs(current: Timestamp) {
    this.syncExpired(current);

    return this.historyList;
  }
}

export namespace PointAccount {
  export type GetParam = {
    executedAt?: Timestamp
  }

  export type AddParam = {
    amount: number
    memo?: string
    expiredAt?: Timestamp
    executedAt?: Timestamp
  }

  export type UseParam = {
    amount: number
    transactionId?: string
    memo?: string
    executedAt?: Timestamp
  }

  export type RefundParam = {
    amount: number
    transactionId: string
    memo?: string
    executedAt?: Timestamp
  }
}
