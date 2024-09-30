import { Module, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
import { NodeIdGetter } from '@libs/common/modules/id-generator/internal/node-id-getter';
import { IdGenerator } from '@libs/common/modules/id-generator/id-generator';
import { RedisModule } from '@libs/infrastructure/redis/redis.module';

const BASE_DATE = new Date('2020-01-01');

@Module({
  imports: [
    RedisModule,
  ],
  providers: [
    {
      provide: NodeIdGetter,
      useFactory: (
        redis: Redis,
      ) => new NodeIdGetter(
        redis,
        IdGenerator.getMaxNodeId(),
      ),
      inject: [Redis],
    },
  ],
})
export class IdGeneratorModule implements OnModuleInit {

  constructor(
    private readonly nodeIdGetter: NodeIdGetter,
  ) {}

  async onModuleInit() {
    const nodeId = await this.nodeIdGetter.get();
    IdGenerator.init(nodeId, BASE_DATE);
  }
}
