import { Injectable } from '@nestjs/common';
import { PointApi } from '@libs/features/point/api/point.api';
import { PointLog } from '@libs/features/point/domain/point-log';
import { Result, ResultSync } from '@libs/common/model/result/result';
import { RefundPointError, UsePointError } from '@libs/features/point/domain/point.error';
import { PointLogRepository } from '@libs/features/point/domain/point-log.repository';
import { PointAccount } from '@libs/features/point/domain/point-account';
import { Timestamp } from '@libs/common/types/timestamp';

@Injectable()
export class PointApiImpl implements PointApi {

  constructor(
    private readonly pointLogRepository: PointLogRepository,
  ) {}

  async add(
    userId: string,
    point: number,
    expiredAt?: Date,
    memo: string = '',
  ): Promise<void> {
    await this.addToLog(userId, {
      type: 'ADD',
      amount: point,
      memo: memo,
      expiredAt: expiredAt || null,
      createdAt: new Date(),
    });
  }

  async get(
    userId: string,
  ): Promise<number> {
    const account = await this.restoreAccount(userId);

    return account.get();
  }

  async use(
    userId: string,
    point: number,
    transactionId: string,
    memo: string = '',
  ): ResultSync<void, UsePointError> {
    const current = Timestamp.now();
    const account = await this.restoreAccount(userId);
    const result = account.use({
      amount: point,
      transactionId: transactionId,
      executedAt: current,
    });

    if (result.isError) {
      return result;
    }

    await this.addToLog(userId, {
      type: 'USE',
      amount: point,
      transactionId: transactionId,
      createdAt: new Date(current),
      memo: memo,
    });

    return Result.ok();
  }

  async getHistories(
    userId: string,
  ): Promise<PointLog[]> {
    return this.pointLogRepository.get(userId);
  }

  async refund(
    userId: string,
    point: number,
    transactionId: string,
    memo: string = '',
  ): ResultSync<void, RefundPointError> {
    const current = Timestamp.now();
    const account = await this.restoreAccount(userId);

    const result = account.refund({
      amount: point,
      transactionId: transactionId,
      executedAt: current,
    });

    if (result.isError) {
      return result;
    }

    await this.addToLog(userId, {
      type: 'REFUND',
      amount: point,
      transactionId: transactionId,
      memo: memo,
      createdAt: new Date(current),
    });

    return Result.ok();
  }

  private async restoreAccount(userId: string) {
    const list = await this.pointLogRepository.get(userId);
    list.sort((
      t1,
      t2,
    ) => +t1.createdAt - +t2.createdAt);

    const account = PointAccount.create();
    for (const log of list) {
      switch (log.type) {
        case 'ADD':
          account.add({
            amount: log.amount,
            expiredAt: log.expiredAt ? Timestamp.of(log.expiredAt) : undefined,
            executedAt: Timestamp.of(log.createdAt),
          });
          break;
        case 'USE':
          account.use({
            amount: log.amount,
            transactionId: log.transactionId || undefined,
            executedAt: Timestamp.of(log.createdAt),
          });
          break;
        case 'REFUND':
          account.refund({
            amount: log.amount,
            transactionId: log.transactionId,
            executedAt: Timestamp.of(log.createdAt),
          });
          break;
      }
    }

    return account;
  }

  private async addToLog(
    userId: string,
    logs: PointLog | PointLog[],
  ) {
    await this.pointLogRepository.add(userId, logs);
  }
}
