import { CartRepository } from '@libs/features/cart/domain/cart.repository'
import { Cart } from '@libs/features/cart/domain/cart'
import { CartItemMapper } from '@libs/features/cart/infra/cart-item.mapper'
import { CartItemEntity } from '@libs/features/cart/infra/cart-item.entity'

export class CartRepositoryImpl<T> implements CartRepository<T> {

  private storage = new Map<string, CartItemEntity[]>

  constructor(
    private readonly mapper: CartItemMapper<T>,
  ) {}

  find(memberId: string): Promise<Cart<T>> {
    const entityList = this.storage.get(memberId) || []
    const cartItemList = entityList.map(
      (entity) => this.mapper.toDomain(entity),
    )

    return Promise.resolve(
      new Cart(cartItemList),
    )
  }

  save(
    memberId: string,
    cart: Cart<T>,
  ): Promise<void> {
    const entityList = cart.items.map(
      (item) => this.mapper.toPersistence(item),
    )
    this.storage.set(memberId, entityList)

    return Promise.resolve()
  }
}
