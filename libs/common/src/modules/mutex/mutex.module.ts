import { Module, OnModuleInit } from '@nestjs/common'
import { RedisModule } from '@libs/infrastructure/redis/redis.module'
import { MutexService } from '@libs/common/modules/mutex/service/mutex.service'
import { MutexServiceImpl } from '@libs/common/modules/mutex/service/mutex.service.impl'
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import { DEFAULT_RETRY_DELAY, DEFAULT_TIMEOUT } from '@libs/common/modules/mutex/constants/mutex.constants'
import { Mutex } from '@libs/common/modules/mutex/decorator/mutex.decorator'


@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: MutexService,
      useClass: MutexServiceImpl,
    },
  ],
})
export class MutexModule implements OnModuleInit {
  constructor(
    private readonly lockService: MutexService,
    private readonly discoveryService: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit(): any {
    return this
      .discoveryService
      .getProviders()
      .filter((wrapper) => wrapper.isDependencyTreeStatic())
      .filter(({ instance }) => instance && Object.getPrototypeOf(instance))
      .forEach(({ metatype, instance }) => {
        const methodNames = this.metadataScanner.getAllMethodNames(Object.getPrototypeOf(instance))
        for (const methodName of methodNames) {
          const option = this.reflector.get<Mutex.Option<any>>(Mutex.key, instance[methodName])
          if (!option) {
            continue
          }

          const originalMethod = instance[methodName]
          instance[methodName] = async (...args: any[]) => {
            const lock = await this.lockService.getLock(
              option.name(args),
              option.timeout ?? DEFAULT_TIMEOUT,
              option.retryDelay ?? DEFAULT_RETRY_DELAY,
            )
            try {
              return await originalMethod.call(instance, ...args)
            } finally {
              await lock.done()
            }
          }
        }
      })

  }

}
