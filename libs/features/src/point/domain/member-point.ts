import {
  AddPointCommand,
  DeductPointCommand,
  PointCommand,
  RefundPointCommand,
} from '@libs/features/point/domain/internal/command/point-command';
import { PointDetail } from '@libs/features/point/domain/internal/detail/point-detail';
import { PointCalculator } from '@libs/features/point/domain/internal/detail/point-detail-collection';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';
import { assertNever } from '@libs/common/util/global-function';
import { PointAddedDetail } from '@libs/features/point/domain/internal/detail/point-added-detail';
import { PointUsedDetail } from '@libs/features/point/domain/internal/detail/point-used-detail';
import { ArrayUtil } from '@libs/common/util/array/array.util';
import { PointRefundDetail } from '@libs/features/point/domain/internal/detail/point-refund-detail';

export class MemberPoint {

  readonly commandList: PointCommand[] = [];
  readonly detailList: PointDetail[] = [];

  constructor(
    private expirationCompletionAt: Date,
  ) {}

  get calculator(): PointCalculator {
    return new PointCalculator(this.detailList);
  }

  get balance(): PointAmount {
    return PointAmount.of(
      this.calculator.getBalance(),
    );
  }

  static create() {
    return new MemberPoint(new Date(0));
  }

  static replay(
    commandList: PointCommand[],
  ) {
    const sortedCommandList = [...commandList]
      .sort((
        t1,
        t2,
      ) => t1.createdAt.getTime() - t2.createdAt.getTime());

    const memberPoint = MemberPoint.create();
    for (const command of sortedCommandList) {
      memberPoint.execute(command);
    }
    return memberPoint;
  }

  expirePointUntil(date: Date) {
    if (this.expirationCompletionAt.getTime() > date.getTime()) {
      throw new Error();
    }

    this.syncExpired(date);
    return this;
  }

  execute(command: PointCommand) {
    if (this.expirationCompletionAt.getTime() > command.createdAt.getTime()) {
      throw Error(`lastCommand: ${this.expirationCompletionAt}, createdAt: ${command.createdAt}`);
    }

    switch (command.type) {
      case 'add':
        this.add(command);
        break;
      case 'deduct':
        this.deduct(command);
        break;
      case 'refund':
        this.refund(command);
        break;
      default:
        throw assertNever(command);
    }

    this.commandList.push(command);
    return this;
  }

  nextId() {
    return Math.max(
      0,
      ...this
        .commandList
        .filter(t => t.id != null)
        .map(t => t.id!),
    ) + 1;
  }

  private add(
    command: AddPointCommand,
  ) {
    const detail = PointAddedDetail.create(command);
    this.detailList.push(detail);

    return this;
  }

  private deduct(
    command: DeductPointCommand,
  ) {
    if (command.amount > this.balance) {
      throw Error(`currentPoint: ${this.balance}, use: ${command.amount}`);
    }

    if (
      command.transactionId &&
      this.hasTransactionId(command.transactionId)
    ) {
      throw Error(`already transactionId: ${command.transactionId}`);
    }

    const detailList = this.createDeductList(command);
    this.detailList.push(...detailList);

    return this;
  }

  private refund(
    command: RefundPointCommand,
  ) {
    const refundableAmount = this.calculator.getUsedBalance(command.transactionId);
    if (command.amount > refundableAmount) {
      throw Error(`refundableAmount: ${refundableAmount}, refund: ${command.amount}`);
    }

    const detailList = this.createRefundList(command);
    this.detailList.push(...detailList);

    return this;
  }

  private hasTransactionId(transactionId: string) {
    return this.commandList.some(
      t => t.type === 'deduct' &&
           t.transactionId === transactionId,
    );
  }

  private createDeductList(
    command: DeductPointCommand,
  ) {
    // 전체 지급내역 & 정렬
    const addedDetailList = this.getAddedDetailList()
                                .sort(
                                  // 만료기간이 짧은순으로 먼저 사용
                                  (
                                    t1,
                                    t2,
                                  ) => t1.expirationAt.getTime() - t2.expirationAt.getTime(),
                                );

    let needAmount: number = command.amount;
    const result: PointUsedDetail[] = [];

    for (const addedDetail of addedDetailList) {
      // 지급 포인트 중 남은 금액
      const balanceAmount = this.calculator.getBalanceByAddedDetailId(addedDetail.id);

      // 해당 지급건에서 사용할 금액
      const useAmount = Math.min(needAmount, balanceAmount);

      result.push(
        PointUsedDetail.create(
          command.transactionId!,
          addedDetail,
          PointAmount.of(useAmount),
        ),
      );

      needAmount -= useAmount;
      if (needAmount === 0) {
        return result;
      }
    }

    throw Error('point over');
  }

  private getAddedDetailList() {
    return ArrayUtil
      .distinct(
        this.detailList.map(t => t.addedDetail),
        t => t.id,
      );
  }

  private createRefundList(
    command: RefundPointCommand,
  ) {
    const refDetailList = ArrayUtil
      .distinct(
        this.detailList
            .filter(
              t => t.transactionId === command.transactionId,
            )
            .map(t => t.addedDetail),
        t => t.addedDetail.id,
      )
      .sort((
        t1,
        t2,
      ) => t2.expirationAt.getTime() - t1.expirationAt.getTime());

    let needAmount: number = command.amount;
    const result: PointRefundDetail[] = [];

    for (const addedDetail of refDetailList) {
      const usedBalance = this.calculator.getTransactionAmountByAddedId(command.transactionId, addedDetail.id);
      if (usedBalance === 0) {
        continue;
      }

      const refund = Math.min(needAmount, usedBalance);
      needAmount -= refund;

      result.push(
        PointRefundDetail.create(
          PointAmount.of(refund),
          command.transactionId!,
          addedDetail,
        ),
      );

      if (needAmount === 0) {
        return result;
      }
    }

    throw Error();
  }

  private syncExpired(date: Date) {

    // 전체 지급 내역
    const addedDetailListList = this.getAddedDetailList();

    for (const addedDetail of addedDetailListList) {
      // 만료포인트 아닌경우 패스
      if (!addedDetail.isExpired(date)) {
        continue;
      }

      // 남은 금액 없으면 패스
      const balance = this.calculator.getBalanceByAddedDetailId(addedDetail.id);
      if (balance === 0) {
        continue;
      }

      // 만료처리
      this.execute(
        PointCommand.create({
          type: 'deduct',
          memo: 'expired',
          amount: balance,
          createdAt: addedDetail.expirationAt,
        }),
      );
    }

    this.expirationCompletionAt = new Date(
      Math.max(
        ...this.commandList.map(t => t.createdAt.getTime()),
      ),
    );
  }
}

