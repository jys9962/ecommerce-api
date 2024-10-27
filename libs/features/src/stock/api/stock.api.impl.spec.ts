import { Test } from '@nestjs/testing';
import { StockModule } from '@libs/features/stock/stock.module';
import { StockApi } from '@libs/features/stock/api/stock.api';
import { StockRepository } from '@libs/features/stock/domain/stock.repository';

import { Injectable } from '@nestjs/common';
import { LockModule } from '@libs/common/modules/lock/lock.module';

@Injectable()
export class SampleStockRepository implements StockRepository {

  private data = new Map<string, number>();

  async find(code: string): Promise<number | null> {
    return this.data.get(code) || null;
  }

  async save(
    code: string,
    quantity: number,
  ): Promise<void> {
    this.data.set(code, quantity);
  }

  async delete(code: string): Promise<void> {
    this.data.delete(code);
  }

}

describe('StockApi', function () {
  let stockApi: StockApi;

  beforeEach(async function () {
    const module = await Test.createTestingModule({
      imports: [
        LockModule,
        StockModule,
      ],
    })
      .overrideProvider(StockRepository)
      .useClass(SampleStockRepository)
      .compile();

    await module.init();

    stockApi = module.get(StockApi);
  });

  it('defined', async function () {
    expect(stockApi).toBeDefined();
  });

  it('재고 설정', async function () {
    const code = 'A';
    const quantity = 10;

    await stockApi.set(code, quantity);

    const result = await stockApi.get(code);

    expect(result).toBe(quantity);
  });

  it('설정된 재고 없을 경우 0 아닌 null', async function () {
    const code = '-1';

    const result = await stockApi.get(code);

    expect(result).toBeNull();
  });

  it('재고 차감', async function () {
    const code = 'A';
    await stockApi.set(code, 10);
    await stockApi.update(code, -5);

    const result = await stockApi.get(code);

    expect(result).toBe(5);
  });

  it('재고 부족한 경우 예외 발생', async function () {
    const code = 'A';
    await stockApi.set(code, 10);

    const result = () => stockApi.update(code, -100);

    await expect(result).rejects.toThrow();
  });

  it('재고 설정 안된 상태에서 재고량 증가하는 경우 재고량이 설정됨', async function () {
    const code = 'A';
    const quantity = 100;

    await stockApi.update(code, quantity);

    const result = await stockApi.get(code);

    expect(result).toBe(quantity);
  });

  it('재고 삭제하는 경우', async function () {
    const code = 'A';
    await stockApi.set(code, 100);

    await stockApi.delete(code);
    const result = await stockApi.get(code);

    expect(result).toBeNull();
  });

  it('재고 수정 동시성 확인', async function () {
    const code = 'A';
    const concurrency = 100;
    const perQuantity = 10;

    const promiseList = Array.from({ length: concurrency })
      .map(() => stockApi.update(code, perQuantity));
    await Promise.all(promiseList);

    const result = await stockApi.get(code);

    expect(result).toBe(concurrency * perQuantity);
  });

});
