import { Module } from '@nestjs/common';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { MemberApiImpl } from '@libs/features/member/api/member.api.impl';
import { MemberSignupValidator } from './domain/member-signup.validator';
import { MemberRepository } from './domain/member.repository';
import { MemberRepositoryImpl } from '@libs/features/member/infra/member.repository.impl';
import { MemberApi } from '@libs/features/member/api/member.api';

const domain: Provider[] = [
  MemberSignupValidator,
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
