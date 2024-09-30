import { Injectable } from '@nestjs/common'
import { MutexService } from '@libs/common/modules/mutex/service/mutex.service'
import { Doable } from '@libs/common/modules/mutex/model/doable'
import Redis from 'ioredis'
import { sleep } from '@libs/common/util/global-function'

@Injectable()
export class MutexServiceImpl implements MutexService {

  constructor(
    private readonly redis: Redis,
  ) {}

  async getLock(
    name: string,
    timeout: number,
    retryDelay: number,
  ): Promise<Doable> {
    const lockName = `lock.${name}`
    const timeoutAt = await this.acquireLock(lockName, timeout, retryDelay)

    return {
      done: async () => {
        if (Date.now() > timeoutAt) {
          return
        }

        await this.redis.del(lockName)
      },
    }
  }

  private async acquireLock(
    lockName: string,
    timeout: number,
    retryDelay: number,
  ): Promise<number> {
    const timeoutAt = Date.now() + timeout + 1

    const result = await this.redis.set(lockName, timeoutAt, 'PX', timeout, 'NX')
    if (result === 'OK') {
      return timeoutAt
    }

    await sleep(retryDelay)
    return this.acquireLock(lockName, timeout, retryDelay)
  }
}
