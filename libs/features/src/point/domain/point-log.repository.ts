import { PointLog } from '@libs/features/point/domain/point-log';

export abstract class PointLogRepository {

  abstract get(
    userId: string,
  ): Promise<PointLog[]>

  abstract save(
    userId: string,
    logs: PointLog[],
  ): Promise<void>

  abstract add(
    userId: string,
    logs: PointLog | PointLog[],
  ): Promise<void>
}
