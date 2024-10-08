import { PointCommand } from '@libs/features/point/domain/internal/command/point-command'
import { IPointCommandEntity, PointCommandEntity } from '@libs/features/point/infra/entity/point-command.entity'
import { Timestamp } from '@libs/common/types/timestamp'

export namespace PointCommandMapper {

  export const toPersistence = (
    memberId: string,
    pointCommand: PointCommand,
  ): IPointCommandEntity => {
    return {
      pk: PointCommandEntity.key('pk', {
        memberId: memberId.toString(),
      }),
      sk: PointCommandEntity.key('sk', {
        id: pointCommand.id!.toString(),
      }),
      memo: pointCommand.memo,
      amount: pointCommand.amount,
      createdAt: Timestamp.of(pointCommand.createdAt),
      type: pointCommand.type,
      expirationAt: pointCommand.type === 'add'
        ? Timestamp.of(pointCommand.expirationAt)
        : null,
      transactionId: ('transactionId' in pointCommand)
        ? pointCommand.transactionId?.toString() ?? null
        : null,
    }
  }

  export const toDomain = (
    entity: IPointCommandEntity,
  ): PointCommand => {
    const fromEntity = PointCommandEntity.parse(entity)

    return <PointCommand>{
      id: fromEntity.sk.id
        ? Number(fromEntity.sk.id)
        : undefined,
      memo: entity.memo || '',
      type: entity.type,
      createdAt: new Date(entity.createdAt),
      amount: entity.amount,
      transactionId: fromEntity.transactionId
        ? BigInt(fromEntity.transactionId)
        : undefined,
      expirationAt: entity.expirationAt
        ? new Date(entity.expirationAt)
        : undefined,
    }
  }


}
