import { Test } from '@nestjs/testing'
import { LockModule } from '@libs/common/modules/lock/lock.module'
import { Injectable } from '@nestjs/common'
import { UseLock } from '@libs/common/modules/lock/decorator/use-lock.decorator'
import { sleep } from '@libs/common/util/global-function'

@Injectable()
class TestService {
  public number = 0

  @UseLock<TestService['test']>({
    name: (args) => `TestService.test.${args[0]}`,
  })
  async test(key: string) {
    const current = this.number
    await sleep(30)
    this.number = current + 1
  }

}

describe('RedisLockService', function () {

  let service: TestService

  beforeEach(async function () {
    const module = await Test.createTestingModule({
      imports: [
        LockModule,
      ],
      providers: [
        TestService,
      ],
    }).compile()
    await module.init()

    service = module.get(TestService)
  })

  it('정상동작 확인', async function () {
    service.number = 0

    await Promise.all(
      Array.from({ length: 10 }).map(
        () => service.test('a'),
      ),
    )

    expect(service.number).toBe(10)
  })


})
