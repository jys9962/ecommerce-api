export class MapUtil {

  static by<T, K extends PropertyKey>(
    list: T[],
    getKey: (item: T) => K,
  ): Record<K, T>

  static by<T, K extends PropertyKey, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue: (item: T) => V,
  ): Record<K, V>

  static by<T, K extends PropertyKey, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue?: (item: T) => V,
  ): Record<K, T | V> {
    return list
      .reduce(
        (
          acc,
          t,
        ) => {
          const key = getKey(t);
          const value: V | T = getValue ? getValue(t) : t;
          acc[key] = value;
          return acc;
        },
        {} as Record<K, T | V>,
      );
  }

  static groupBy<T, K extends PropertyKey>(
    list: T[],
    getKey: (item: T) => K,
  ): Record<K, T[]>

  static groupBy<T, K extends PropertyKey, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue: (item: T) => V,
  ): Record<K, V[]>

  static groupBy<T, K extends PropertyKey, V>(
    list: T[],
    getKey: (item: T) => K,
    getValue?: (item: T) => V,
  ): Record<K, (T | V)[]> {
    return list
      .reduce(
        (
          acc,
          t,
        ) => {
          const key = getKey(t);
          const value: V | T = getValue ? getValue(t) : t;
          if (!(key in acc)) {
            acc[key] = [];
          }
          acc[key].push(value);
          return acc;
        },
        {} as Record<K, (T | V)[]>,
      );
  }

}
