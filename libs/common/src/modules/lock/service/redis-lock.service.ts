import { Injectable } from '@nestjs/common';
import { LockService } from '@libs/common/modules/lock/service/lock.service';
import { Doable } from '@libs/common/modules/lock/model/doable';
import Redis from 'ioredis';
import { RedisPubSub } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub';

@Injectable()
export class RedisLockService implements LockService {

  constructor(
    private readonly redis: Redis,
    private readonly redisPubSub: RedisPubSub,
  ) {}

  async getLock(
    name: string,
    timeout: number,
  ): Promise<Doable> {
    const lockName = `lock.${name}`;
    const timeoutAt = await this.acquireLock(lockName, timeout);

    return {
      done: async () => {
        if (Date.now() > timeoutAt) {
          return;
        }

        await this.releaseLock(lockName, timeoutAt);
      },
    };
  }

  private async acquireLock(
    lockName: string,
    timeout: number,
  ): Promise<number> {
    const timeoutAt = Date.now() + timeout + 1;

    const result = await this.redis.set(lockName, timeoutAt, 'PX', timeout, 'NX');
    if (result === 'OK') {
      return timeoutAt;
    }
    await this.waitRetry(lockName);

    return this.acquireLock(lockName, timeout);
  }

  private waitRetry(
    lockName: string,
  ) {
    return new Promise(resolve => {
      const callback = () => {
        resolve(undefined);
        this.redisPubSub.unsubscribe(lockName, callback);
      };
      return this.redisPubSub.subscribe(lockName, callback);
    });
  }

  private async releaseLock(
    lockName: string,
    timeoutAt: number,
  ): Promise<void> {
    const script = `
       if redis.call("get", KEYS[1]) == ARGV[1] then
         return redis.call("del", KEYS[1])
       else
         return 0
       end
     `;

    const result = await this.redis.eval(script, 1, lockName, timeoutAt.toString());

    if (result != 1) {
      return;
    }

    await this.redisPubSub.publish(lockName, '');
  }
}
