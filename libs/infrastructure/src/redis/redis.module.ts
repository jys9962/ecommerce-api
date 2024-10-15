import { DynamicModule, Module } from '@nestjs/common'
import Redis from 'ioredis'
import { RedisFactory } from '@libs/infrastructure/redis/redis.factory'
import { RedisPubSub } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub'
import { RedisPubSubImpl } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub.impl'

@Module({
  providers: [
    RedisFactory,
    {
      provide: Redis,
      useFactory: (factory: RedisFactory) => factory.create(),
      inject: [RedisFactory],
    },
    {
      provide: RedisPubSub,
      useClass: RedisPubSubImpl,
    },
  ],
  exports: [
    Redis,
  ],
})
export class RedisModule {}
