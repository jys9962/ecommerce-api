import { Injectable } from '@nestjs/common'
import { LockService } from '@libs/common/modules/lock/service/lock.service'
import { Doable } from '@libs/common/modules/lock/model/doable'
import Redis from 'ioredis'
import { RedisPubSub } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub'

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
    const lockName = `lock.${name}`
    const timeoutAt = await this.acquireLock(lockName, timeout)

    return {
      done: async () => {
        if (Date.now() > timeoutAt) {
          return
        }
        await this.redis.del(lockName)
        await this.redisPubSub.publish(lockName, '')
      },
    }
  }

  private async acquireLock(
    lockName: string,
    timeout: number,
  ): Promise<number> {
    const timeoutAt = Date.now() + timeout + 1

    const result = await this.redis.set(lockName, timeoutAt, 'PX', timeout, 'NX')
    if (result === 'OK') {
      return timeoutAt
    }

    await new Promise(resolve => this.redisPubSub.subscribe(lockName, resolve))

    return this.acquireLock(lockName, timeout)
  }
}
