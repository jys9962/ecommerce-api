import { ArrayUtil } from '@/common/util/array/array.util';

describe('ArrayUtil', function() {

  describe('distinct', function() {

    it('number', async function() {
      const result = ArrayUtil.distinct([1, 2, 1, 1, 2, 1, 2, 1]);
      expect(result.sort()).toStrictEqual([1, 2]);
    });

    it('string', async function() {
      const result = ArrayUtil.distinct(['a', 'b', 'a', 'c', 'd'])
      expect(result.sort()).toStrictEqual(['a', 'b', 'c', 'd'])
    });
  });
});
