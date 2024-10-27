export type Day = number & { _brand: 'Day' };

export namespace Day {
  export function of(
    year: number,
    monthIndex?: number,
    day?: number,
  ): Day
  export function of(
    date: Date,
  ): Day
  export function of(
    ...args: any
  ): Day {
    const [year, monthIndex, day] = args[0] instanceof Date
      ? [args[0].getFullYear(), args[0].getMonth(), args[0].getDay()]
      : args

    return new Date(year, monthIndex, day).getTime() as Day
  }
}
