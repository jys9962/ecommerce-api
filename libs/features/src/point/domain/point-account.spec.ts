import { PointAccount } from '@libs/features/point/domain/point-account';
import { Timestamp } from '@libs/common/types/timestamp';
import { RefundPointError } from '@libs/features/point/domain/point.error';
import { PointLog } from '@libs/features/point/domain/point-log';

describe('PointAccount', function () {

  it('최초 0원', async function () {
    const account = PointAccount.create();

    const currentPoint = account.get();

    expect(currentPoint).toBe(0);
  });

  it('포인트 지급', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 1000,
    });
    const result = account.get();

    expect(result).toBe(1000);
  });

  it('포인트 사용', async function () {
    const pointAccount = PointAccount.create();

    pointAccount.add({
      amount: 1000,
    });

    const result = pointAccount.use({
      amount: 500,
    });

    const amount = pointAccount.get();

    expect(result.isOk).toBe(true);
    expect(amount).toBe(500);
  });

  it('포인트 사용 금액 부족한 경우 오류 반환', async function () {
    const pointAccount = PointAccount.create();

    pointAccount.add({
      amount: 1000,
    });

    const result = pointAccount.use({
      amount: 2000,
    });
    const amount = pointAccount.get();

    expect(result.isError).toBe(true);
    expect(amount).toBe(1000);
  });

  it('포인트 만료', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 1000,
      executedAt: Timestamp.now(),
      expiredAt: Timestamp.nextDay(1),
    });

    const amount = account.get({
      executedAt: Timestamp.nextDay(2),
    });

    expect(amount).toBe(0);
  });

  it('포인트 만료가 임박한 순으로 사용됨', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 1000,
      expiredAt: Timestamp.nextDay(5),
      executedAt: Timestamp.now(),
    });
    account.add({
      amount: 2000,
      expiredAt: Timestamp.nextDay(2),
      executedAt: Timestamp.now(),
    });
    account.add({
      amount: 3000,
      expiredAt: undefined,
      executedAt: Timestamp.now(),
    });

    account.use({
      amount: 500,
      executedAt: Timestamp.now(),
    });
    const amount = account.get({
      executedAt: Timestamp.nextDay(3),
    });

    expect(amount).toBe(4000);
  });

  it('포인트 환불시 금액이 복구됨', async function () {
    const account = PointAccount.create();
    account.add({
      amount: 5000,
    });
    account.use({
      amount: 3000,
      transactionId: 'A100',
    });

    const result = account.refund({
      amount: 2000,
      transactionId: 'A100',
    });
    const amount = account.get();

    expect(result.isOk).toBe(true);
    expect(amount).toBe(4000);
  });

  it('포인트 환불시 유효기간이 오래 남은 순으로 환불됨', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 1000,
      expiredAt: Timestamp.nextDay(10),
    });
    account.add({
      amount: 2000,
      expiredAt: Timestamp.nextDay(5),
    });
    account.add({
      amount: 3000,
      expiredAt: Timestamp.nextDay(15),
    });
    account.use({
      amount: 5000,
      transactionId: 'A100',
    });

    account.refund({
      amount: 1000,
      transactionId: 'A100',
    });

    const amount = account.get({
      executedAt: Timestamp.nextDay(12),
    });

    expect(amount).toBe(2000);
  });

  it('환불하려는 금액이 사용했던 금액보다 큰 경우 오류 반환', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 5000,
    });
    account.use({
      amount: 3000,
      transactionId: 'A100',
    });
    const result = account.refund({
      amount: 4000,
      transactionId: 'A100',
    });
    const amount = account.get();

    expect(result.isError && result.error).toBe(<RefundPointError>'not_enough_to_refund');
    expect(amount).toBe(2000);
  });

  it('환불하려는 금액이 사용했던 금액보다 큰 경우 오류 반환 - 2', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 5000,
    });
    account.use({
      amount: 3000,
      transactionId: 'A100',
    });
    account.refund({
      amount: 1000,
      transactionId: 'A100',
    });

    const result = account.refund({
      amount: 3000,
      transactionId: 'A100',
    });
    const amount = account.get();

    expect(result.isError && result.error).toBe(<RefundPointError>'not_enough_to_refund');
    expect(amount).toBe(3000);
  });

  it('환불하려는 transactionId 가 사용된 적 없는 id 인 경우 오류 반환', async function () {
    const account = PointAccount.create();

    account.add({
      amount: 5000,
    });
    account.use({
      amount: 3000,
      transactionId: 'A100',
    });

    const result = account.refund({
      amount: 2000,
      transactionId: 'A200',
    });
    const amount = account.get();

    expect(result.isError && result.error).toBe(<RefundPointError>'not_enough_to_refund');
    expect(amount).toBe(2000);
  });

  it('로그 조회', async function () {
    const account = PointAccount.create();
    const now = Timestamp.now()

    const expiredAt = Timestamp.nextDay(10);
    account.add({
      amount: 5000,
      expiredAt: expiredAt,
      executedAt: now
    });
    account.use({
      amount: 3000,
      executedAt: now
    })

    const list = account.getLogs(Timestamp.nextDay(15))
    expect(list).toStrictEqual([
        {
         "amount": 5000,
         "createdAt": new Date(now),
         "expiredAt": new Date(expiredAt),
         "memo": "",
         "type": "ADD",
       },
        {
         "amount": 3000,
         "createdAt": new Date(now),
         "memo": "",
         "transactionId": null,
         "type": "USE",
       },
        {
         "amount": 2000,
         "createdAt": new Date(expiredAt),
         "memo": "",
         "type": "EXPIRED",
       },
     ]
    )
  });
});
