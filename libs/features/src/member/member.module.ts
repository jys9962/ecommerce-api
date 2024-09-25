import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { MemberApiImpl } from '@libs/features/member/api/member.api.impl';
import { MemberSignUpValidator } from './domain/member-sign-up.validator';
import { MemberRepository } from './domain/member.repository';
import { MemberRepositoryImpl } from '@libs/features/member/infra/member.repository.impl';
import { MemberApi } from '@libs/features/member/api/member.api';

const domain: Provider[] = [
  MemberSignUpValidator,
  {
    provide: MemberRepository,
    useClass: MemberRepositoryImpl,
  },
];

const api: Provider[] = [
  {
    provide: MemberApi,
    useClass: MemberApiImpl,
  },
];

@Module({
  providers: [
    ...domain,
    ...api,
  ],
  exports: [
    ...api,
  ],
})
export class MemberModule {}
