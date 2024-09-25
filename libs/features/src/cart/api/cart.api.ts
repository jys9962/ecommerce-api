import { CartItem } from '@libs/features/cart/domain/cart-item'

export abstract class CartApi<T> {

  abstract find(
    memberId: string,
  ): Promise<CartItem<T>[]>

  abstract add(
    memberId: string,
    cartItem: CartItem.Param<T>,
  ): Promise<void>

  abstract update(
    memberId: string,
    cartItemId: string,
    cartItemParam: CartItem.Param<T>,
  ): Promise<void>

  abstract delete(
    memberId: string,
    cartItemId: string,
  ): Promise<void>

  abstract clear(
    memberId: string,
  ): Promise<void>

}
