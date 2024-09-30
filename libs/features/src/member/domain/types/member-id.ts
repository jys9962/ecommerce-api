import { IdGenerator } from '@libs/common/modules/id-generator/id-generator';

export type MemberId = string & { _brand: 'MemberId' };

export namespace MemberId {
  export function next(): MemberId {
    return IdGenerator.nextId() as MemberId;
  }

  export function of(value: string): MemberId {
    return value as MemberId;
  }
}
