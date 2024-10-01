import { ShippingInfo } from '@libs/features/shipping/model/shipping-info'
import { Address } from '@libs/features/shipping/model/address'
import { TrackingInfo } from '@libs/features/shipping/model/tracking-info'
import { ShippingStatus } from '@libs/features/shipping/model/shipping-status'

export abstract class ShippingApi {

  abstract start(
    orderId: string,
    shippingAddress: Address,
  ): Promise<ShippingInfo>;

  abstract getStatus(
    orderId: string,
  ): Promise<ShippingStatus>;

  abstract cancel(
    orderId: string,
  ): Promise<void>;

  abstract trackShipment(
    trackingNumber: string,
  ): Promise<TrackingInfo>;

  abstract updateAddress(
    orderId: string,
    newAddress: Address,
  ): Promise<void>;

}
