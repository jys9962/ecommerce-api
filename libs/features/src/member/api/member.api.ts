import { Member } from '@libs/features/member/domain/member';

export abstract class MemberApi {

  abstract register(
    email: string,
    nickname: string,
    password: string,
  ): Promise<string>;

  abstract findById(
    memberId: string,
  ): Promise<Member | null>;

  abstract findByEmail(
    email: string,
  ): Promise<Member | null>;

}
