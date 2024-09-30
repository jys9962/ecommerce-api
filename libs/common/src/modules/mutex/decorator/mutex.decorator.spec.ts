import { Mutex } from '@libs/common/modules/mutex/decorator/mutex.decorator'

export class TestService {

  @Mutex<TestService['test']>({
    name: ([key]) => `name.${key}`,
  })
  test(
    key: string,
    b: number,
  ) {

  }
}


describe('Lock', function () {

})
