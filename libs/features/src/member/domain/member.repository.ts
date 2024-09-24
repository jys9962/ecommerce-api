import { MemberId } from './types/member-id';
import { Member } from './member';
import { MemberEmail } from '@libs/features/member/domain/types/member-email';

export abstract class MemberRepository {

  abstract findByEmail(
    email: MemberEmail,
  ): Promise<Member | null>

  abstract findById(
    id: MemberId,
  ): Promise<Member>;

  abstract save(
    member: Member,
  ): Promise<void>;

  abstract exist(
    email: MemberEmail,
  ): Promise<boolean>

}
