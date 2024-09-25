export type CartItemPrice = number & { _brand: 'CartItemPrice' };

export namespace CartItemPrice {
  export function isValid(value: number): value is CartItemPrice {
    return true
  }

  export function of(value: number): CartItemPrice {
    if (!isValid(value)) {
      throw Error()
    }

    return value
  }
}
