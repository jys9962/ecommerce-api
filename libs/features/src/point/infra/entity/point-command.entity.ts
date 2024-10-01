import { DynamoEntityBuilder } from '@jys9962/typed-dynamo'
import { PointAmount } from '@libs/features/point/domain/types/point-amount'
import { Timestamp } from '@libs/common/types/timestamp'

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
  .build()

export type IPointCommandEntity = DynamoEntityBuilder.Type<typeof PointCommandEntity>
