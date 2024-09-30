import { Doable } from '@libs/common/modules/mutex/model/doable'

export abstract class MutexService {

  abstract getLock(
    name: string,
    timeout: number,
    retryDelay: number,
  ): Promise<Doable>

}
