import { Module } from '@nestjs/common';
import { StockApi } from '@libs/features/stock/api/stock.api';
import { StockApiImpl } from '@libs/features/stock/api/stock.api.impl';
import { StockRepository } from '@libs/features/stock/domain/stock.repository';

@Module({
  providers: [
    {
      provide: StockApi,
      useClass: StockApiImpl,
    },
    StockRepository as any,
  ],
})
export class StockModule {}
