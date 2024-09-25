import { DynamicModule, Module } from '@nestjs/common'
import { CartItemComparator } from '@libs/features/cart/domain/cart-item-comparator'
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface'
import { CartApi } from '@libs/features/cart/api/cart.api'
import { CartApiImpl } from '@libs/features/cart/api/cart.api.impl'
import { CartRepository } from '@libs/features/cart/domain/cart.repository'
import { CartRepositoryImpl } from '@libs/features/cart/infra/cart.repository.impl'
import { CartItemOptionSerializer } from '@libs/features/cart/domain/cart-item-option-serializer'

const domain: Provider[] = [
  {
    provide: CartRepository,
    useClass: CartRepositoryImpl,
  },
]

const api: Provider[] = [
  {
    provide: CartApi,
    useClass: CartApiImpl,
  },
]

@Module({
  providers: [
    ...domain,
    ...api,
  ],
  exports: [
    ...api,
  ],
})
export class CartModule {
  static register<T>(
    comparator: CartItemComparator<T>,
    serializer: CartItemOptionSerializer<T>,
  ): DynamicModule {
    return {
      providers: [
        {
          provide: CartItemComparator,
          useValue: comparator,
        },
        {
          provide: CartItemOptionSerializer,
          useValue: serializer,
        },
      ],
      module: CartModule,
      global: false,
    }
  }
}
