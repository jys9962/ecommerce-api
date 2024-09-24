import { Result } from '@libs/common/result/result';

describe('Result', function () {
  it('ok', async function () {
    const result = Result.ok({ id: 1 });

    expect(result.isOk).toBe(true);
    expect(result.isError).toBe(false);
    expect(result.data).toStrictEqual({ id: 1 });
  });

  it('err', async function () {
    const result = Result.err({ message: 'error' });

    expect(result.isOk).toBe(false);
    expect(result.isError).toBe(true);
    expect(result.error).toStrictEqual({ message: 'error' });
  });

  it.skip('타입 확인', async function () {
    const result = Result.ok(1) as Result<number, string>;

    const isOk: boolean = result.isOk;
    const isError: boolean = result.isError;

    // @ts-expect-error
    const data = result.data;
    // @ts-expect-error
    const error = result.error;

    if (result.isOk) {
      const data: number = result.data;

      // @ts-expect-error
      const error = result.error;
    }
    if (result.isError) {
      const error: string = result.error;

      // @ts-expect-error
      const data = result.data;
    }
  });
});
