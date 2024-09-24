import { Injectable } from '@nestjs/common';
import { Member } from '@libs/features/member/domain/member';
import { MemberSignupValidator } from '@libs/features/member/domain/member-signup.validator';
import { MemberNickname } from '@libs/features/member/domain/types/member-nickname';
import { MemberPassword } from '@libs/features/member/domain/types/member-password';
import { MemberRepository } from '@libs/features/member/domain/member.repository';
import { MemberId } from '@libs/features/member/domain/types/member-id';
import { MemberEmail } from '@libs/features/member/domain/types/member-email';
import { MemberApi } from '@libs/features/member/api/member.api';

@Injectable()
export class MemberApiImpl implements MemberApi {
  constructor(
    private readonly memberSignUpValidator: MemberSignupValidator,
    private readonly memberRepository: MemberRepository,
  ) {}

  async signUp(
    email: string,
    nickname: string,
    password: string,
  ): Promise<Member> {
    const member = Member.create(
      MemberEmail.of(email),
      MemberNickname.of(nickname),
      MemberPassword.fromPlainText(password),
    );

    await this.memberSignUpValidator.validate(member);
    await this.memberRepository.save(member);

    return member;
  }

  async findById(
    memberId: string,
  ): Promise<Member> {
    const member = await this.memberRepository.findById(
      MemberId.of(memberId),
    );

    return member;
  }

  async findByEmail(
    email: string,
    password: string,
  ): Promise<Member> {
    const member = await this.memberRepository.findByEmail(
      MemberEmail.of(email),
    );
    if (!member) {
      throw Error();
    }
    if (!member.isValidPassword(password)) {
      throw Error();
    }

    return member;
  }
}
