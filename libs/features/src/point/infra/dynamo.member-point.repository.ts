import { Injectable } from '@nestjs/common'
import { MemberPointRepository } from '@libs/features/point/domain/member-point.repository'
import { PointCommandDynamo } from '@libs/features/point/infra/dynamo/point-command.dynamo'
import { MemberPoint } from '@libs/features/point/domain/member-point'
import { PointCommandMapper } from '@libs/features/point/infra/mapper/point-command.mapper'

@Injectable()
export class DynamoMemberPointRepository implements MemberPointRepository {

  constructor(
    private readonly pointCommandDynamo: PointCommandDynamo,
  ) {}

  async find(
    memberId: string,
  ): Promise<MemberPoint> {
    const entityResult = await this.pointCommandDynamo.find(memberId)
    if (entityResult.isError) {
      throw Error()
    }
    if (entityResult.data.length === 0) {
      return MemberPoint.create()
    }

    const commandList = entityResult.data.map(
      (command) => PointCommandMapper.toDomain(command),
    )

    return MemberPoint.replay(commandList)
  }

  async save(
    memberId: string,
    memberPoint: MemberPoint,
  ): Promise<void> {
    const newLogEntityList = memberPoint
      .commandList
      .sort((
        t1,
        t2,
      ) => t1.createdAt.getTime() - t2.createdAt.getTime())
      .filter(t => t.id == null)
      .map(
        t => {
          t.id = memberPoint.nextId()
          return PointCommandMapper.toPersistence(memberId, t)
        },
      )

    if (newLogEntityList.length === 0) {
      return
    }

    const saveResult = await this.pointCommandDynamo.save(newLogEntityList)
    if (saveResult.isOk) {
      return
    }

    // todo
    const reasons = saveResult.error.CancellationReasons || []
    throw Error()
  }
}
