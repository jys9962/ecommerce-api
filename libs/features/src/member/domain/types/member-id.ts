import { Member } from '@libs/features/member/domain/member';

export type MemberId = string & { _brand: 'MemberId' };

export namespace MemberId {
  export function next(): MemberId {
    // todo
    return '1' as MemberId;
  }

  export function of(value: string): MemberId {
    return value as MemberId;
  }
}
