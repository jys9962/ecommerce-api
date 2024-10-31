import { PointApiImpl } from '@libs/features/point/api/point.api.impl';
import { Test } from '@nestjs/testing';
import { PointModule } from '@libs/features/point/point.module';
import { PointApi } from '@libs/features/point/api/point.api';

describe('PointApi', function () {
  let pointApi: PointApiImpl;

  beforeEach(async function () {
    const module = await Test.createTestingModule({
      imports: [PointModule],
    })
      .compile();

    await module.init();

    pointApi = module.get(PointApi);
  });

  it('defined', async function () {
    expect(pointApi).toBeDefined();
  });

});
