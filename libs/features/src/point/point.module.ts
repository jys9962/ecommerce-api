import { Module } from '@nestjs/common';
import { PointApi } from '@libs/features/point/api/point.api';
import { PointApiImpl } from '@libs/features/point/api/point.api.impl';
import { PointLogRepository } from '@libs/features/point/domain/point-log.repository';

@Module({
  providers: [
    {
      provide: PointApi,
      useClass: PointApiImpl,
    },
    PointLogRepository as any
  ],
})
export class PointModule {}
