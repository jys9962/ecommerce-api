import { MemberId } from '@libs/features/member/domain/types/member-id'
import { MemberNickname } from '@libs/features/member/domain/types/member-nickname'
import { MemberPassword } from '@libs/features/member/domain/types/member-password'
import { MemberEmail } from '@libs/features/member/domain/types/member-email'

export class Member {

  constructor(
    public id: MemberId,
    public email: MemberEmail,
    public nickname: MemberNickname,
    public password: MemberPassword,
    public createdAt: Date,
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
    )
  }

  isValidPassword(
    inputPassword: string,
  ) {
    return MemberPassword.isMatch(this.password, inputPassword)
  }

}
