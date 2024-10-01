import { Injectable } from '@nestjs/common';
import { Member } from '@libs/features/member/domain/member';
import { MemberRepository } from '@libs/features/member/domain/member.repository';

@Injectable()
export class MemberSignUpValidator {
  constructor(
    private readonly memberRepository: MemberRepository,
  ) {}

  async validate(member: Member): Promise<void> {
    const isEmailDuplicated = await this.memberRepository.exist(member.email);
    if (isEmailDuplicated) {
      throw Error();
    }


  }
}
