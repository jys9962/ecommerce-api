import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { MemberPointRepository } from '@libs/features/point/domain/member-point.repository';
import { DynamoMemberPointRepository } from '@libs/features/point/infra/dynamo.member-point.repository';
import { PointApi } from '@libs/features/point/api/point.api';
import { PointApiImpl } from '@libs/features/point/api/point.api.impl';

const domain: Provider[] = [
  {
    provide: MemberPointRepository,
    useClass: DynamoMemberPointRepository,
  },
];

const api: Provider[] = [
  {
    provide: PointApi,
    useClass: PointApiImpl,
  },
];

@Module({
  imports: [],
  providers: [
    ...domain,
    ...api,
  ],
  exports: [
    ...api,
  ],
})
export class PointModule {}
