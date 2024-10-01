import { CartItemId } from '@libs/features/cart/domain/types/cart-item-id'
import { CartItemName } from '@libs/features/cart/domain/types/cart-item-name'
import { CartItemPrice } from '@libs/features/cart/domain/types/cart-item-price'
import { Timestamp } from '@libs/common/types/timestamp'

export interface CartItemEntity {
  id: CartItemId
  name: CartItemName
  quantity: number
  price: CartItemPrice
  optionString: string
  createdAt: Timestamp
}
