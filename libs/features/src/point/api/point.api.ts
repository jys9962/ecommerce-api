import { ResultSync } from '@libs/common/model/result/result';
import { PointLog } from '@libs/features/point/domain/point-log';
import { RefundPointError, UsePointError } from '@libs/features/point/domain/point.error';
import { PagingDto } from '@libs/common/dto/paging.dto';

export abstract class PointApi {

  abstract get(
    userId: string,
  ): Promise<number>

  abstract getHistories(
    userId: string,
    paging: PagingDto,
  ): Promise<PointLog[]>

  abstract add(
    userId: string,
    point: number,
    memo: string,
    expiredAt: Date | null,
  ): Promise<void>

  abstract use(
    userId: string,
    point: number,
    transactionId: string,
    memo: string,
  ): ResultSync<void, UsePointError>

  abstract refund(
    userId: string,
    point: number,
    transactionId: string,
    memo: string,
  ): ResultSync<void, RefundPointError>

}
