import { CartItemId } from '@libs/features/cart/domain/types/cart-item-id'
import { CartItemPrice } from '@libs/features/cart/domain/types/cart-item-price'
import { CartItemName } from '@libs/features/cart/domain/types/cart-item-name'

export class CartItem<T> {
  constructor(
    public id: CartItemId,
    public name: CartItemName,
    public quantity: number,
    public price: CartItemPrice,
    public option: T,
    public createdAt: Date,
  ) {}

  static create<T>(
    param: CartItem.Param<T>,
  ): CartItem<T> {
    return new CartItem(
      CartItemId.nextId(),
      param.name,
      param.quantity,
      param.price,
      param.option,
      new Date(),
    )
  }

  addQuantity(added: number) {
    this.quantity = this.quantity + added
  }

  update(param: CartItem.Param<T>) {
    this.name = param.name
    this.quantity = param.quantity
    this.price = param.price
    this.option = param.option
  }
}

export namespace CartItem {
  export type Param<T> = {
    name: CartItemName,
    quantity: number,
    price: CartItemPrice,
    option: T,
  }
}
