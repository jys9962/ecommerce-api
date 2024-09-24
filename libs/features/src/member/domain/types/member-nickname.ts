export type MemberNickname = string & { _brand: 'MemberNickname' };

export namespace MemberNickname {
  export function isValid(value: string): value is MemberNickname {
    // todo
    return true;
  }

  export function of(value: string): MemberNickname {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  }
}
