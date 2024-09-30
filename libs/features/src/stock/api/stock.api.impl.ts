import { Injectable } from '@nestjs/common'
import { StockApi } from '@libs/features/stock/api/stock.api'
import { StockDto } from '@libs/features/stock/api/stock.dto'
import { Mutex } from '@libs/common/modules/mutex/decorator/mutex.decorator'

@Injectable()
export class StockApiImpl implements StockApi {

  constructor() {}

  get(code: string[]): Promise<StockDto[]> {
    return Promise.resolve([])
  }

  @Mutex<StockApi['update']>({
    name: ([code]) => `stock.${code}`,
  })
  update(
    code: string,
    quantity: number,
  ): Promise<StockDto[]> {
    return Promise.resolve([])
  }

  @Mutex<StockApi['set']>({
    name: ([code]) => `stock.${code}`,
  })
  set(
    code: string,
    quantity: number,
  ): Promise<void> {
    return Promise.resolve(undefined)
  }

  @Mutex<StockApi['delete']>({
    name: ([code]) => `stock.${code}`,
  })
  delete(code: string[]): Promise<void> {
    return Promise.resolve(undefined)
  }

}
