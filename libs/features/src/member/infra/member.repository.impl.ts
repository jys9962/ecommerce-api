import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../domain/member.repository';
import { MemberId } from '../domain/types/member-id';
import { Member } from '../domain/member';
import { MemberEmail } from '@libs/features/member/domain/types/member-email';

@Injectable()
export class MemberRepositoryImpl implements MemberRepository {
  readonly storageById = new Map<string, Member>;
  readonly storageByEmail = new Map<string, Member>;


  findById(id: MemberId): Promise<Member> {
    const member = this.storageById.get(id);
    if (!member) {
      throw Error();
    }

    return Promise.resolve(
      member,
    );
  }

  save(member: Member): Promise<void> {
    this.storageById.set(member.id, member);
    this.storageByEmail.set(member.email, member);

    return Promise.resolve();
  }

  exist(email: MemberEmail): Promise<boolean> {
    return Promise.resolve(
      this.storageByEmail.has(email),
    );
  }

  findByEmail(email: MemberEmail): Promise<Member | null> {
    return Promise.resolve(
      this.storageByEmail.get(email) || null,
    );
  }


}
