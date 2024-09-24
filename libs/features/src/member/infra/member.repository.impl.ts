import { Injectable } from '@nestjs/common';
import { MemberRepository } from '../domain/member.repository';
import { MemberId } from '../domain/types/member-id';
import { Member } from '../domain/member';

@Injectable()
export class MemberRepositoryImpl implements MemberRepository {

  findById(id: MemberId): Promise<Member> {
    return Promise.resolve(undefined) as any;
  }

  save(member: Member): Promise<void> {
    return Promise.resolve(undefined);
  }


}
