import { MemberId } from '@libs/features/member/domain/types/member-id';
import { MemberNickname } from '@libs/features/member/domain/types/member-nickname';
import { MemberPassword } from '@libs/features/member/domain/types/member-password';
import { MemberEmail } from '@libs/features/member/domain/types/member-email';

export class Member {
  private constructor(
    public readonly id: MemberId,
    public readonly email: MemberEmail,
    public readonly nickname: MemberNickname,
    public readonly password: MemberPassword,
    public readonly createdAt: Date,
  ) {}

  static create(
    email: MemberEmail,
    nickname: MemberNickname,
    password: MemberPassword,
  ) {
    return new Member(
      MemberId.next(),
      email,
      nickname,
      password,
      new Date(),
    );
  }

  isValidPassword(
    inputPassword: string,
  ) {
    const isMatched = MemberPassword.isMatch(this.password, inputPassword);
    return isMatched;
  }

}
