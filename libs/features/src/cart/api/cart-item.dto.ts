import { CartItem } from '@libs/features/cart/domain/cart-item'

export interface CartItemDto<T> {
  id: string
  name: string
  price: number
  quantity: number
  option: T
  createdAt: Date
}

export namespace CartItemDto {
  export function from<T>(cartItem: CartItem<T>): CartItemDto<T> {
    return {
      id: cartItem.id,
      name: cartItem.name,
      price: cartItem.price,
      quantity: cartItem.quantity,
      option: cartItem.option,
      createdAt: cartItem.createdAt,
    }
  }
}
