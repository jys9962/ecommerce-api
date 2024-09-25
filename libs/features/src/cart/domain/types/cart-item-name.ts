export type CartItemName = string & { _brand: 'CartItemName' };

export namespace CartItemName {
  export function isValid(value: string): value is CartItemName {
    return true;
  }

  export function of(value: string): CartItemName {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  }
}
