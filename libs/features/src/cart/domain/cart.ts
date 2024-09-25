import { CartItem } from '@libs/features/cart/domain/cart-item'
import { CartItemComparator } from '@libs/features/cart/domain/cart-item-comparator'

export class Cart<T> {
  constructor(
    public items: CartItem<T>[],
  ) {}

  static new<T>() {
    return new Cart<T>([])
  }

  add(
    param: CartItem.Param<T>,
    comparator: CartItemComparator<T>,
  ) {
    const newItem = CartItem.create(param)

    const sameItem = this.items.find(
      (item) => comparator.isSame(item, newItem),
    )

    if (sameItem) {
      sameItem.addQuantity(newItem.quantity)
    } else {
      this.items.push(newItem)
    }
  }


  update(
    cartItemId: string,
    param: CartItem.Param<T>,
    comparator: CartItemComparator<T>,
  ) {
    const theItem = this.items.find(t => t.id === cartItemId)
    if (!theItem) {
      throw Error()
    }

    theItem.update(param)
    const sameItem = this.items.find(
      t => t.id !== cartItemId
           && comparator.isSame(t, theItem),
    )

    if (!sameItem) {
      return
    }

    sameItem.addQuantity(theItem.quantity)
    this.delete(cartItemId)
  }

  delete(cartItemId: string) {
    const find = this.items.findIndex(t => t.id === cartItemId)
    if (!find) {
      throw Error()
    }

    this.items = this.items.filter(t => t.id !== cartItemId)
  }

  clear() {
    this.items = []
  }
}
