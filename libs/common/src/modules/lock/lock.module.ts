import { Module, OnModuleInit } from '@nestjs/common'
import { RedisModule } from '@libs/infrastructure/redis/redis.module'
import { LockService } from '@libs/common/modules/lock/service/lock.service'
import { RedisLockService } from '@libs/common/modules/lock/service/redis-lock.service'
import { DiscoveryModule, DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core'
import { DEFAULT_TIMEOUT } from '@libs/common/modules/lock/constants/lock.constants'
import { UseLock } from '@libs/common/modules/lock/decorator/use-lock.decorator'


@Module({
  imports: [
    RedisModule,
    DiscoveryModule,
  ],
  providers: [
    {
      provide: LockService,
      useClass: RedisLockService,
    },
  ],
})
export class LockModule implements OnModuleInit {
  constructor(
    private readonly lockService: LockService,
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
          const option = this.reflector.get<UseLock.Option<any>>(UseLock.key, instance[methodName])
          if (!option) {
            continue
          }

          const originalMethod = instance[methodName]
          instance[methodName] = async (...args: any[]) => {
            const lock = await this.lockService.getLock(
              option.name(args),
              option.timeout ?? DEFAULT_TIMEOUT,
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
