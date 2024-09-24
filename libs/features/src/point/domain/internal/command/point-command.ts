import { PointAmount } from '@libs/features/point/domain/types/point-amount';

export type AddPointCommand = {
  type: 'add'
  amount: PointAmount
  memo: string
  expirationAt: Date
  createdAt: Date
}
export type DeductPointCommand = {
  type: 'deduct'
  amount: PointAmount
  memo: string
  transactionId?: string
  createdAt: Date
}
export type RefundPointCommand = {
  type: 'refund'
  amount: PointAmount
  memo: string
  transactionId: string
  createdAt: Date
}

export type PointCommand = { id?: number } &
  (
    AddPointCommand |
    DeductPointCommand |
    RefundPointCommand
    );

export namespace PointCommand {
  export function create<T extends PointCommand>(
    command: T,
  ): T {
    return command;
  }
}

// export class PointCommand {
//   constructor(
//     readonly amount: PointAmount,
//     readonly type: PointType,
//     readonly createdAt: Date,
//     readonly transactionId?: string,
//     readonly expirationAt?: Date,
//   ) { }
//
//   get signedAmount(): number {
//     return ['use', 'expired'].includes(this.type)
//       ? -this.amount
//       : this.amount;
//   }
//
//   static create(
//     param: Pick<PointCommand, 'amount' | 'type' | 'transactionId' | 'expirationAt' | 'createdAt'>,
//   ) {
//     const log = new PointCommand(
//       param.amount,
//       param.type,
//       param.createdAt,
//       param.transactionId,
//       param.expirationAt,
//     );
//     return log;
//   }
// }
