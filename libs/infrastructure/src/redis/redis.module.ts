import { DynamicModule, Module } from '@nestjs/common';
import Redis from 'ioredis';

let redis: Redis;

@Module({
  providers: [
    {
      provide: Redis,
      useFactory: () => {
        if (!redis) {
          throw Error();
        }
        return redis;
      },
    },
  ],
  exports: [
    Redis,
  ],
})
export class RedisModule {
  static forRoot(): DynamicModule {
    redis = new Redis();

    return {
      module: RedisModule,
    };
  }
}
