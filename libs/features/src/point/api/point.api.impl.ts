import { Injectable } from '@nestjs/common';
import { PointApi } from '@libs/features/point/api/point.api';
import { MemberPointRepository } from '@libs/features/point/domain/member-point.repository';
import { MemberPoint } from '@libs/features/point/domain/member-point';
import { PointCommand } from '@libs/features/point/domain/internal/command/point-command';
import { PointAmount } from '@libs/features/point/domain/types/point-amount';
import { PointChangedEvent } from '@libs/features/point/domain/event/point-changed.event';

@Injectable()
export class PointApiImpl implements PointApi {

  constructor(
    private readonly memberPointRepository: MemberPointRepository,
  ) {}

  async get(
    memberId: string,
    currentDate: Date = new Date(),
  ): Promise<number> {
    const memberPoint = await this.memberPointRepository.find(memberId);
    memberPoint.expirePointUntil(currentDate);

    await this.memberPointRepository.save(memberId, memberPoint);

    return memberPoint.balance;
  }

  async add(
    memberId: string,
    amount: number,
    expirationAt: Date,
    currentDate: Date = new Date(),
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);
    memberPoint.expirePointUntil(currentDate);

    const command = PointCommand.create({
      type: 'add',
      memo: '',
      amount: PointAmount.of(amount),
      expirationAt: expirationAt,
      createdAt: currentDate,
    });

    memberPoint.execute(command);

    await this.memberPointRepository.save(memberId, memberPoint);
    await this.publishEvent(memberId, memberPoint);
  }

  async use(
    memberId: string,
    amount: number,
    transactionId: string,
    currentDate: Date = new Date(),
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);
    memberPoint.expirePointUntil(currentDate);

    const command = PointCommand.create({
      type: 'deduct',
      memo: '',
      amount: PointAmount.of(amount),
      transactionId: transactionId,
      createdAt: currentDate,
    });
    memberPoint.execute(command);

    await this.memberPointRepository.save(memberId, memberPoint);
    await this.publishEvent(memberId, memberPoint);
  }

  async refund(
    memberId: string,
    amount: number,
    transactionId: string,
    currentDate: Date = new Date(),
  ): Promise<void> {
    const memberPoint = await this.memberPointRepository.find(memberId);
    memberPoint.expirePointUntil(currentDate);

    const command = PointCommand.create({
      type: 'refund',
      memo: '',
      amount: PointAmount.of(amount),
      transactionId: transactionId,
      createdAt: currentDate,
    });

    memberPoint.execute(command);

    await this.memberPointRepository.save(memberId, memberPoint);
    await this.publishEvent(memberId, memberPoint);
  }

  private async publishEvent(
    memberId: string,
    memberPoint: MemberPoint,
  ) {
    const event = PointChangedEvent.create({
      memberId: memberId,
      balance: memberPoint.balance,
      changedAt: new Date(),
    });

    // todo publish event
  }
}
