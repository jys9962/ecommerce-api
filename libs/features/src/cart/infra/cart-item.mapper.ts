import { CartItem } from '@libs/features/cart/domain/cart-item'
import { CartItemOptionSerializer } from '@libs/features/cart/domain/cart-item-option-serializer'
import { CartItemEntity } from '@libs/features/cart/infra/cart-item.entity'
import { Timestamp } from '@libs/common/type/timestamp'

export class CartItemMapper<T> {
  constructor(
    private readonly serializer: CartItemOptionSerializer<T>,
  ) {}

  toPersistence(
    cartItem: CartItem<T>,
  ): CartItemEntity {
    return {
      id: cartItem.id,
      name: cartItem.name,
      createdAt: Timestamp.of(cartItem.createdAt),
      optionString: this.serializer.serialize(cartItem.option),
      price: cartItem.price,
      quantity: cartItem.quantity,
    }
  }

  toDomain(
    entity: CartItemEntity,
  ): CartItem<T> {
    return new CartItem(
      entity.id,
      entity.name,
      entity.quantity,
      entity.price,
      this.serializer.deserialize(entity.optionString),
      new Date(entity.createdAt),
    )
  }

}
