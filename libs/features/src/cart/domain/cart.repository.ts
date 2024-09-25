import { Cart } from '@libs/features/cart/domain/cart';

export abstract class CartRepository<T> {

  abstract find(
    memberId: string,
  ): Promise<Cart<T>>

  abstract save(
    memberId: string,
    cart: Cart<T>,
  ): Promise<void>

}
