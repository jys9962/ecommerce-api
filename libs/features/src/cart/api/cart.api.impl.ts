import { CartApi } from '@libs/features/cart/api/cart.api'
import { CartItem } from '@libs/features/cart/domain/cart-item'
import { CartRepository } from '@libs/features/cart/domain/cart.repository'
import { CartItemComparator } from '@libs/features/cart/domain/cart-item-comparator'

export class CartApiImpl<T> implements CartApi<T> {

  constructor(
    private readonly cartRepository: CartRepository<T>,
    private readonly cartItemComparator: CartItemComparator<T>,
  ) {}

  async add(
    memberId: string,
    param: CartItem.Param<T>,
  ): Promise<void> {
    const cart = await this.cartRepository.find(memberId)
    cart.add(param, this.cartItemComparator)

    await this.cartRepository.save(memberId, cart)
  }

  async clear(memberId: string): Promise<void> {
    const cart = await this.cartRepository.find(memberId)
    cart.clear()

    await this.cartRepository.save(memberId, cart)
  }

  async delete(
    memberId: string,
    cartItemId: string,
  ): Promise<void> {
    const cart = await this.cartRepository.find(memberId)
    cart.delete(cartItemId)

    await this.cartRepository.save(memberId, cart)
  }

  async find(memberId: string): Promise<CartItem<T>[]> {
    const cart = await this.cartRepository.find(memberId)
    return cart.items
  }

  async update(
    memberId: string,
    cartItemId: string,
    param: CartItem.Param<T>,
  ): Promise<void> {
    const cart = await this.cartRepository.find(memberId)
    cart.update(cartItemId, param, this.cartItemComparator)

    await this.cartRepository.save(memberId, cart)
  }


}
