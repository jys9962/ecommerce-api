import { OrderDto } from '@libs/features/order/api/dto/order.dto'

export abstract class OrderApi {

  abstract place(
    memberId: string,
  ): Promise<OrderDto>


  


}
