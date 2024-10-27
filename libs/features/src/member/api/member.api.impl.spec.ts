import { Test } from '@nestjs/testing';
import { MemberModule } from '@libs/features/member/member.module';
import { MemberApi } from '@libs/features/member/api/member.api';
import { MemberRepository } from '@libs/features/member/domain/member.repository';


describe('MemberApi', function () {
  let memberApi: MemberApi;
  let memberRepository: MemberRepository;

  beforeEach(async function () {
    const module = await Test.createTestingModule({
      imports: [MemberModule],
    })
      .compile();

    await module.init();

    memberApi = module.get(MemberApi);
    memberRepository = module.get(MemberRepository);
  });

  it('defined', async function () {
    expect(memberApi).toBeDefined();
  });

  it('회원가입', async function () {
    const email = 'jys@email.com';
    const nickname = 'jys';
    const password = '12345678!@#';
    const newId = await memberApi.register(
      email,
      nickname,
      password,
    );

    const byEmail = await memberApi.findByEmail(email);
    const byId = await memberApi.findById(newId);

    expect(byEmail).toBeDefined();
    expect(byEmail!.email).toBe(email);
    expect(byEmail!.nickname).toBe(nickname);

    expect(byId).toBeDefined();
    expect(byId!.email).toBe(email);
    expect(byId!.nickname).toBe(nickname);

  });

  it('이미 있는 이메일인 경우 오류', async function () {
    const email = 'jys@email.com';
    jest.spyOn(memberRepository, 'exist').mockResolvedValue(true);

    const result = () => memberApi.register(
      email,
      'nickname',
      'password',
    );

    await expect(result).rejects.toThrow();
  });

});
