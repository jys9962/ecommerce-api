import Redis from 'ioredis';
import { NodeIdGetter } from '@libs/common/modules/id-generator/internal/node-id-getter';

describe('NodeIdGetter', () => {
  let redis: Redis;

  beforeAll(async () => {
    redis = new Redis({
      host: 'localhost',
      port: 6379,
    });
  });

  afterAll(async () => {
    // 테스트 후 Redis 연결 종료
    await redis.quit();
  });

  beforeEach(async () => {
    // 테스트 전에 Redis 키 초기화
    await redis.del('nodeId');
  });

  it('기본 기능 확인', async function() {
    const count = 20;
    const sut = new NodeIdGetter(redis, 9);

    const ids = await Promise.all(
      Array
        .from({ length: count })
        .map(() => sut.get()),
    );
    const expected = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ];

    expect(ids).toStrictEqual(expected);
  });

  it('최대값 확인', async function() {
    const sut = new NodeIdGetter(redis, 10);

    for (let i = 0; i < 100; i++) {
      const id = await sut.get();

      expect(id <= 10).toBe(true);
    }
  });

  it('동시호출 확인', async () => {
    const requestCount = 100;
    const sut = new NodeIdGetter(redis, 100);

    const ids = await Promise.all(
      Array.from({ length: requestCount })
           .map(() => sut.get()),
    );

    const distinctSize = new Set(ids).size;
    expect(distinctSize).toBe(requestCount);
  });

  it('동시호출 + 최대값 확인', async function() {
    const sut = new NodeIdGetter(redis, 3);

    const ids = await Promise.all(
      Array
        .from({ length: 8 })
        .map(() => sut.get()),
    );
    const ids2 = await Promise.all(
      Array
        .from({ length: 8 })
        .map(() => sut.get()),
    );

    expect(ids).toStrictEqual([0, 1, 2, 3, 0, 1, 2, 3]);
    expect(ids2).toStrictEqual([0, 1, 2, 3, 0, 1, 2, 3]);


  });

});
