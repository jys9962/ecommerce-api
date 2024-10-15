import { RedisPubSubImpl } from '@libs/infrastructure/redis/pub-sub/redis-pub-sub.impl'
import Redis from 'ioredis'
import { Test } from '@nestjs/testing'
import { RedisFactory } from '@libs/infrastructure/redis/redis.factory'
import { sleep } from '@libs/common/util/global-function'

describe('RedisPubSubImpl', function () {

  let redisPubSub: RedisPubSubImpl

  beforeAll(async function () {

    const module = await Test.createTestingModule({
      providers: [
        RedisFactory,
        {
          provide: Redis,
          useFactory: (factory: RedisFactory) => factory.create(),
          inject: [RedisFactory],
        },
        RedisPubSubImpl,
      ],
    }).compile()

    await module.init()
    redisPubSub = module.get(RedisPubSubImpl)
  })

  it('기본 기능', async function () {
    const channel = 'aaaaaaaaaaaa'
    const message = 'myMessage'

    let receiveMessage, onChannel
    const subscribePromise = new Promise(resolve => {
      redisPubSub.subscribe(channel, function (
        channel,
        message,
      ) {
        receiveMessage = message
        onChannel = channel
        resolve(undefined)
      })
    })

    await redisPubSub.publish(channel, message)

    await Promise.any([
      sleep(3000),
      subscribePromise,
    ])

    expect(receiveMessage).toBe(message)
    expect(onChannel).toBe(channel)
  })

})
