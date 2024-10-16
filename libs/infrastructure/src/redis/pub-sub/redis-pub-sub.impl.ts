import { Injectable, OnModuleInit } from '@nestjs/common'
import { RedisPubSub } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub'
import Redis from 'ioredis'
import { RedisFactory } from '@libs/infrastructure/redis/redis.factory'

@Injectable()
export class RedisPubSubImpl implements RedisPubSub, OnModuleInit {
  static readonly CHANNEL_PREFIX = 'dist.'

  private subscribeList = new Map<string, Function[]>()
  private subscriber: Redis

  constructor(
    private readonly publisher: Redis,
    private readonly factory: RedisFactory,
  ) {
    this.subscriber = factory.create()
  }

  async publish(
    channel: string,
    message: string,
  ): Promise<void> {
    const pChannel = `${RedisPubSubImpl.CHANNEL_PREFIX}${channel}`
    await this.publisher.publish(pChannel, message)
  }

  subscribe(
    channel: string,
    callback: (
      channel: string,
      message: string,
    ) => any,
  ): void {
    const list = this.subscribeList.get(channel) || []
    list.push(callback)
    this.subscribeList.set(channel, list)
  }

  unsubscribe(
    channel: string,
    callback: Function,
  ): void {
    const list = (
      this.subscribeList.get(channel) || []
    ).filter(cb => cb !== callback)

    if (list.length === 0) {
      this.subscribeList.delete(channel)
    } else {
      this.subscribeList.set(channel, list)
    }
  }


  async onModuleInit() {
    const channelPattern = `${RedisPubSubImpl.CHANNEL_PREFIX}*`
    await new Promise(resolve => {
      this.subscriber.psubscribe(channelPattern, (
        err,
        success,
      ) => {
        if (err) {
          throw Error()
        }
        resolve(undefined)
      })
    })

    this.subscriber.on('pmessage', (
      pattern,
      channel,
      message,
    ) => {
      if (channelPattern !== pattern) {
        return
      }

      const userChannel = channel.slice(RedisPubSubImpl.CHANNEL_PREFIX.length)
      const list = this.subscribeList.get(userChannel)
      if (!list) {
        return
      }

      list.forEach((callback) => callback(userChannel, message))
    })
  }

}
