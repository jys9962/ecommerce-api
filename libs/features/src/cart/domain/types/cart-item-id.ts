import { IdGenerator } from '@libs/common/id-generator/id-generator';

export type CartItemId = string & { _brand: 'CartItemId' };

export namespace CartItemId {
  export function nextId(): CartItemId {
    return IdGenerator.nextId() as CartItemId;
  }
}
