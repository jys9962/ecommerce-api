import { PointApiImpl } from '@libs/features/point/api/point.api.impl';
import { Test } from '@nestjs/testing';
import { PointModule } from '@libs/features/point/point.module';
import { PointApi } from '@libs/features/point/api/point.api';
import { PointLogRepository } from '@libs/features/point/domain/point-log.repository';
import { Injectable } from '@nestjs/common';
import { PointLog } from '@libs/features/point/domain/point-log';

const userId = '1';

@Injectable()
export class FakeRepository implements PointLogRepository {
  data = new Map<string, PointLog[]>;

  async get(userId: string): Promise<PointLog[]> {
    return this.data.get(userId) || [];
  }

  async save(
    userId: string,
    logs: PointLog[],
  ): Promise<void> {
    this.data.set(userId, logs);
  }

}

describe('PointApi', function () {
  let pointApi: PointApiImpl;

  beforeEach(async function () {
    const module = await Test.createTestingModule({
      imports: [PointModule],
    })
      .overrideProvider(PointLogRepository)
      .useClass(FakeRepository)
      .compile();

    await module.init();

    pointApi = module.get(PointApi);
  });

  it('defined', async function () {
    expect(pointApi).toBeDefined();
  });

  it('최초 0 포인트', async function () {
    const result = await pointApi.get(userId);
    expect(result).toBe(0);
  });

  it('포인트 증가', async function () {
    await pointApi.add(userId, 1000);

    const result = await pointApi.get(userId);

    expect(result).toBe(1000);
  });

  it('포인트 감소', async function () {
    await pointApi.add(userId, 1000);

    await pointApi.use(userId, 500, 'A100');
    const result = await pointApi.get(userId);

    expect(result).toBe(500);
  });

  it('사용할 포인트 부족한 경우 오류 리턴, 감소안함', async function () {
    await pointApi.add(userId, 1000);

    const result = await pointApi.use(userId, 2000, 'A200');
    const currentPoint = await pointApi.get(userId);

    expect(result.isError).toBeTruthy();
    expect(currentPoint).toBe(1000);
  });
});
