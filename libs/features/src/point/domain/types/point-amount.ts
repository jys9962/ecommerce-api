export type PointAmount = number & { _brand: 'PointAmount' }

export namespace PointAmount {
  export const of = (
    value: number,
  ): PointAmount => {
    return Math.abs(value) as PointAmount;
  };
}
