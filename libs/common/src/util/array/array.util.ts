export namespace ArrayUtil {

  export function distinct<T extends number | string>(
    list: T[],
  ): T[]
  export function distinct<TKey extends number | string | bigint, T>(
    list: T[],
    getKey: (t: T) => TKey,
  ): T[]
  export function distinct<TKey extends number | string | bigint, T>(
    list: T[],
    getKey?: (t: T) => TKey,
  ) {
    if (!getKey) {
      return Array.from(new Set(list));
    }

    const dic = {} as Record<string, T>;
    for (const t of list) {
      dic[`${getKey(t)}`] = t;
    }
    return Object.values(dic);
  }
}
