import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'

@Injectable()
export class RedisFactory {

  constructor() {}

  create(): Redis {
    const redis = new Redis()
    return redis
  }


}
