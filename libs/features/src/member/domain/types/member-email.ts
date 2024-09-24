export type MemberEmail = string & { _brand: 'MemberEmail' };

export namespace MemberEmail {
  export function isValid(value: string): value is MemberEmail {
    // todo
    return true;
  }

  export function of(value: string): MemberEmail {
    if (!isValid(value)) {
      throw Error();
    }

    return value;
  }
}
