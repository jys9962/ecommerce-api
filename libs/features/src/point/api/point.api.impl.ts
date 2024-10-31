import { Injectable } from '@nestjs/common';
import { PointApi } from '@libs/features/point/api/point.api';
import { PointLog } from '@libs/features/point/domain/point-log';
import { Result, ResultSync } from '@libs/common/model/result/result';
import { RefundPointError, UsePointError } from '@libs/features/point/domain/point.error';
import { PointLogRepository } from '@libs/features/point/domain/point-log.repository';

@Injectable()
export class PointApiImpl implements PointApi {

  constructor(
    private readonly pointLogRepository: PointLogRepository,
  ) {}

  async add(
    userId: string,
    point: number,
    expiredAt?: Date,
    memo?: string,
  ): Promise<void> {
    return Promise.resolve(undefined);
  }

  async get(userId: string): Promise<number> {
    return Promise.resolve(0);
  }

  async getHistories(userId: string): Promise<PointLog[]> {
    return Promise.resolve([]);
  }

  async refund(
    userId: string,
    point: number,
    transactionId: string,
    memo?: string,
  ): ResultSync<void, RefundPointError> {
    return Result.ok();
  }

  async use(
    userId: string,
    point: number,
    transactionId: string,
    memo?: string,
  ): ResultSync<void, UsePointError> {
    return Result.ok();
  }


}
