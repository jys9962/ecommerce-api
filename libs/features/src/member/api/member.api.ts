import { Member } from '@libs/features/member/domain/member'

export abstract class MemberApi {

  /**
   * 회원 추가
   *
   * @param email
   * @param nickname
   * @param password
   */
  abstract register(
    email: string,
    nickname: string,
    password: string,
  ): Promise<Member>;

  /**
   * 아이디로 조회
   *
   * @param memberId
   */
  abstract findById(
    memberId: string,
  ): Promise<Member>;

  /**
   * 이메일과 비밀번호로 조회
   *
   * @param email
   * @param password
   */
  abstract findByEmail(
    email: string,
    password: string,
  ): Promise<Member>;

}
