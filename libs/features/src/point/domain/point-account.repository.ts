import { Inject, Injectable } from '@nestjs/common'
import { PointLog } from '@libs/features/point/domain/point-log';
import { Timestamp } from '@libs/common/types/timestamp';
import { assertNever } from '@libs/common/util/global-function';
import { PointAccount } from '@libs/features/point/domain/point-account';

@Injectable()
export class PointAccountRepository {

  constructor(

  ) {}

  static replay(historyList: PointLog[]): PointAccount {
    return [...historyList]
      .sort(
        (
          t1,
          t2,
        ) => +t1.createdAt - +t2.createdAt,
      )
      .reduce(
        (
          account,
          log,
        ) => {
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
            case 'EXPIRED':
              account.use({
                amount: log.amount,
                transactionId: undefined,
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
            default:
              return assertNever();
          }

          return account;
        },
        new PointAccount(),
      );
  }



}
