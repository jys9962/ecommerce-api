import { PointDetail } from '@libs/features/point/domain/internal/detail/point-detail';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';
import { PointAddedDetail } from '@libs/features/point/domain/internal/detail/point-added-detail';
import { IdGenerator } from '@libs/common/modules/id-generator/id-generator';

export class PointRefundDetail implements PointDetail {

  constructor(
    readonly id: string,
    readonly amount: PointAmount,
    readonly transactionId: string,
    readonly addedDetail: PointAddedDetail,
  ) {}

  get signedAmount() {
    return this.amount;
  }

  static create(
    amount: PointAmount,
    transactionId: string,
    addedDetail: PointAddedDetail,
  ) {
    return new PointRefundDetail(
      IdGenerator.nextId(),
      amount,
      transactionId,
      addedDetail,
    );
  }
}
