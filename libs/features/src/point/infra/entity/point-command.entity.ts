import { PointAmount } from '@/feature/point/domain/branded-types/point-amount';
import { Timestamp } from '@/common/branded-types/timestamp/timestamp';
import { DynamoEntityBuilder } from '@jys9962/typed-dynamo';

export const PointCommandEntity = DynamoEntityBuilder
  .create({
    pk: 'pointCommand#{memberId}',
    sk: '{id}',
  })
  .with<{
    type: 'deduct' | 'add' | 'refund'
    memo: string
    amount: PointAmount
    transactionId: string | null
    expirationAt: Timestamp | null
    createdAt: Timestamp
  }>()
  .build();

export type IPointCommandEntity = DynamoEntityBuilder.Type<typeof PointCommandEntity>
