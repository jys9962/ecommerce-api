export type Timestamp = number & { _brand: 'Timestamp' }

export namespace Timestamp {

  export function today(): Timestamp {
    const date = new Date();
    return Timestamp.of(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
  }

  export function now(): Timestamp {
    return Date.now() as Timestamp;
  }

  export function of(
    year: number,
    monthIndex?: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
    ms?: number,
  ): Timestamp
  export function of(
    date: Date,
  ): Timestamp
  export function of(
    ...args: any
  ): Timestamp {
    if (args[0] instanceof Date) {
      return args[0].getTime() as Timestamp;
    }
    // @ts-ignore
    return new Date(...args).getTime() as Timestamp;
  }

  export function nextDay(day = 1): Timestamp {
    return (
      Timestamp.now() + Timestamp.day(day)
    ) as Timestamp;
  }

  export const sec = (value = 1): Timestamp => 1000 * value as Timestamp;
  export const min = (value = 1): Timestamp => sec(60) * value as Timestamp;
  export const hour = (value = 1): Timestamp => min(60) * value as Timestamp;
  export const day = (value = 1): Timestamp => hour(24) * value as Timestamp;
  export const week = (value = 1): Timestamp => day(7) * value as Timestamp;
}

