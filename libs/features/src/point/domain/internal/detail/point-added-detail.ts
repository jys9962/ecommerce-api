import { PointDetail } from '@libs/features/point/domain/internal/detail/point-detail';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';
import { AddPointCommand } from '@libs/features/point/domain/internal/command/point-command';
import { IdGenerator } from '@libs/common/id-generator/id-generator';

export class PointAddedDetail implements PointDetail {

  constructor(
    readonly id: string,
    readonly amount: PointAmount,
    readonly expirationAt: Date,
  ) {}

  get signedAmount(): number {
    return this.amount;
  }

  get usedDetail() {
    return null;
  }

  get addedDetail() {
    return this;
  }

  get transactionId() {
    return undefined;
  }

  static create(
    command: AddPointCommand,
  ) {
    return new PointAddedDetail(
      IdGenerator.nextId(),
      command.amount,
      command.expirationAt!,
    );
  }

  isExpired(date: Date = new Date()) {
    return date.getTime() >= this.expirationAt.getTime();
  }
}
