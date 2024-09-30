import { Module } from '@nestjs/common'
import { RedisModule } from '@libs/infrastructure/redis/redis.module'

@Module({
  imports: [RedisModule],
})
export class StockModule {}
