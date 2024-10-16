import { Doable } from '@libs/common/modules/lock/model/doable'

export abstract class LockService {

  abstract getLock(
    name: string,
    timeout: number,
  ): Promise<Doable>

}
