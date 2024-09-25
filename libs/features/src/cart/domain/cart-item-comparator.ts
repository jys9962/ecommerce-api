import { CartItem } from '@libs/features/cart/domain/cart-item';

export abstract class CartItemComparator<T> {

  abstract isSame(
    item1: CartItem<T>,
    item2: CartItem<T>,
  ): boolean

}
