import { Module } from '@nestjs/common';
import { IdGeneratorModule } from '@libs/common/id-generator/id-generator.module';

@Module({
  imports: [
    IdGeneratorModule,
  ],
  controllers: [],
  providers: [],
})
export class UserApiModule {}
