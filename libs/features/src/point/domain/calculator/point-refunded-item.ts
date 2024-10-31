import { Timestamp } from '@libs/common/types/timestamp';

export class PointRefundedItem {

  constructor(
    readonly amount: number,
    readonly createdAt: Timestamp,
  ) {}

  static create(
    amount: number,
    current: Timestamp,
  ) {
    return new PointRefundedItem(
      amount, current,
    );
  }
}
