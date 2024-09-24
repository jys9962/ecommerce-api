import { MemberPoint } from '@libs/features/point/domain/member-point';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';

describe('MemberPoint', () => {

  it('최초 0원', async function () {
    const memberPoint = MemberPoint.create();

    // 최초생성시 0원
    expect(memberPoint.balance).toBe(0);
  });

  it('포인트 지급시 잔액 증가', async function () {
    const memberPoint = MemberPoint.create();
    memberPoint.execute({
      type: 'add',
      memo: '',
      amount: PointAmount.of(1000),
      expirationAt: new Date(2100, 0, 1),
      createdAt: new Date(),
    });

    expect(memberPoint.balance).toBe(1000);
  });

  it('포인트 사용시 잔액 차감', async function () {
    const memberPoint = MemberPoint.create();
    memberPoint.execute({
      type: 'add',
      memo: '',
      amount: PointAmount.of(5000),
      expirationAt: new Date(2100, 0, 1),
      createdAt: new Date(),
    });
    memberPoint.execute({
      type: 'deduct',
      memo: '',
      transactionId: '1',
      amount: PointAmount.of(1000),
      createdAt: new Date(),
    });

    expect(memberPoint.balance).toBe(4000);
  });

  it('사용기한이 지나는 경우', async function () {
    const memberPoint = MemberPoint
      .create()
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(5000),
        expirationAt: new Date(2100, 0, 1),
        createdAt: new Date(),
      })
      .expirePointUntil(
        new Date(2120, 1, 1),
      );

    expect(memberPoint.balance).toBe(0);
  });

  it('사용 후 취소', async function () {
    const memberPoint = MemberPoint
      .create()
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(5000),
        expirationAt: new Date(2100, 0, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'deduct',
        memo: '',
        amount: PointAmount.of(3000),
        transactionId: '100',
        createdAt: new Date(),
      })
      .execute({
        type: 'refund',
        memo: '',
        amount: PointAmount.of(2000),
        transactionId: '100',
        createdAt: new Date(),
      });

    expect(memberPoint.balance).toBe(4000);
  });

  it('포인트 사용은 유효기간이 짧은순으로 사용됨', async function () {
    const memberPoint = MemberPoint
      .create()
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(1000),
        expirationAt: new Date(2100, 6, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(2000),
        expirationAt: new Date(2100, 0, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(3000),
        expirationAt: new Date(2100, 3, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'deduct',
        memo: '',
        amount: PointAmount.of(500),
        transactionId: '1',
        createdAt: new Date(),
      })
      .expirePointUntil(
        new Date(2100, 1, 1),
      );

    expect(memberPoint.balance).toBe(4000);
  });

  it('포인트 사용 취소 후 유효기간이 복구됨', async function () {
    const memberPoint = MemberPoint
      .create()
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(1000),
        expirationAt: new Date(2100, 6, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(2000),
        expirationAt: new Date(2100, 3, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(3000),
        expirationAt: new Date(2100, 5, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'deduct',
        memo: '',
        amount: PointAmount.of(4000),
        transactionId: '1',
        createdAt: new Date(),
      })
      .execute({
        type: 'refund',
        memo: '',
        amount: PointAmount.of(4000),
        transactionId: '1',
        createdAt: new Date(),
      })
      .expirePointUntil(
        new Date(2100, 4, 1),
      );

    expect(memberPoint.balance).toBe(4000);
  });

  it('포인트 환불 후 유효기간이 긴 순으로 복구됨', async function () {
    const memberPoint = MemberPoint
      .create()
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(1000),
        expirationAt: new Date(2100, 6, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(2000),
        expirationAt: new Date(2100, 3, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'add',
        memo: '',
        amount: PointAmount.of(3000),
        expirationAt: new Date(2100, 5, 1),
        createdAt: new Date(),
      })
      .execute({
        type: 'deduct',
        memo: '',
        amount: PointAmount.of(4000),
        transactionId: '1',
        createdAt: new Date(),
      })
      .execute({
        type: 'refund',
        memo: '',
        amount: PointAmount.of(3500),
        transactionId: '1',
        createdAt: new Date(),
      })
      .expirePointUntil(
        new Date(2100, 4, 1),
      );

    expect(memberPoint.balance).toBe(4000);
  });
});
