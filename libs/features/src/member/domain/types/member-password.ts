export type MemberPassword = string & { _brand: 'MemberPassword' };

export namespace MemberPassword {
  export function encrypt(value: string): MemberPassword {
    // todo
    return value as MemberPassword;
  }

  export function isMatch(
    password: MemberPassword,
    input: string,
  ): boolean {
    // todo
    return true;
  }

  export function ofEncrypted(value: string): MemberPassword {
    return value as MemberPassword;
  }

  export function fromPlainText(value: string): MemberPassword {
    return encrypt(value);
  }
}
