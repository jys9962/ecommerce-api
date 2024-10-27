import { Injectable } from '@nestjs/common';
import { StockApi } from '@libs/features/stock/api/stock.api';
import { UseLock } from '@libs/common/modules/lock/decorator/use-lock.decorator';
import { StockRepository } from '@libs/features/stock/domain/stock.repository';

@Injectable()
export class StockApiImpl implements StockApi {

  constructor(
    private readonly stockRepository: StockRepository,
  ) {}

  @UseLock<StockApi['get']>({
    name: ([code]) => `stock.${code}`,
  })
  async get(code: string): Promise<number | null> {
    const quantity = await this.stockRepository.find(code);
    return quantity || null;
  }

  @UseLock<StockApi['update']>({
    name: ([code]) => `stock.${code}`,
  })
  async update(
    code: string,
    quantity: number,
  ): Promise<number> {
    const current = await this.stockRepository.find(code) || 0;
    const next = current + quantity;

    if (next < 0) {
      throw Error();
    }

    await this.stockRepository.save(code, next);
    return next;
  }

  @UseLock<StockApi['set']>({
    name: ([code]) => `stock.${code}`,
  })
  async set(
    code: string,
    quantity: number,
  ): Promise<void> {
    await this.stockRepository.save(code, quantity);
  }

  @UseLock<StockApi['delete']>({
    name: ([code]) => `stock.${code}`,
  })
  async delete(code: string): Promise<void> {
    await this.stockRepository.delete(code);
  }

}
