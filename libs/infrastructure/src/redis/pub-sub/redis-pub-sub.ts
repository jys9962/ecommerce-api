import Redis from 'ioredis'

export abstract class RedisPubSub {

  abstract subscribe(
    channel: string,
    callback: Function,
  ): void

  abstract publish(
    channel: string,
    message: string,
  ): Promise<void>

}
