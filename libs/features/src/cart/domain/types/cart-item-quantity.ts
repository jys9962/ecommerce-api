export type CartItemQuantity = number & { _brand: 'CartItemQuantity' };

export namespace CartItemQuantity {
  export function isValid(value: number): value is CartItemQuantity {
    return true;
  }

  export function of(value: number): CartItemQuantity {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  }
}
