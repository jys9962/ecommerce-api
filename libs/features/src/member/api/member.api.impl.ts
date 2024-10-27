import { Injectable } from '@nestjs/common';
import { Member } from '@libs/features/member/domain/member';
import { MemberSignUpValidator } from '@libs/features/member/domain/member-sign-up.validator';
import { MemberNickname } from '@libs/features/member/domain/types/member-nickname';
import { MemberPassword } from '@libs/features/member/domain/types/member-password';
import { MemberRepository } from '@libs/features/member/domain/member.repository';
import { MemberId } from '@libs/features/member/domain/types/member-id';
import { MemberEmail } from '@libs/features/member/domain/types/member-email';
import { MemberApi } from '@libs/features/member/api/member.api';

@Injectable()
export class MemberApiImpl implements MemberApi {
  constructor(
    private readonly memberSignUpValidator: MemberSignUpValidator,
    private readonly memberRepository: MemberRepository,
  ) {}

  async register(
    email: string,
    nickname: string,
    password: string,
  ): Promise<string> {
    const member = Member.create(
      MemberEmail.of(email),
      MemberNickname.of(nickname),
      MemberPassword.fromPlainText(password),
    );

    await this.memberSignUpValidator.validate(member);
    await this.memberRepository.save(member);

    return member.id;
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
  ): Promise<Member | null> {
    const member = await this.memberRepository.findByEmail(
      MemberEmail.of(email),
    );
    if (!member) {
      throw Error();
    }

    return member;
  }
}
