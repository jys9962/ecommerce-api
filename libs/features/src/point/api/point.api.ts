export abstract class PointApi {

  /**
   * 회원 포인트 조회
   *
   * @param memberId
   */
  abstract get(
    memberId: string,
  ): Promise<number>

  /**
   * 포인트 적립
   * @param memberId
   * @param amount
   * @param expirationAt
   */
  abstract add(
    memberId: string,
    amount: number,
    expirationAt: Date,
  ): Promise<void>

  /**
   * 포인트 사용
   * @param memberId
   * @param amount 사용 포인트
   * @param transactionId 거래번호
   */
  abstract use(
    memberId: string,
    amount: number,
    transactionId: string,
  ): Promise<void>

  /**
   * 포인트 사용 취소
   * @param memberId
   * @param amount 취소할 포인트
   * @param transactionId 포인트 사용한 거래번호
   */
  abstract refund(
    memberId: string,
    amount: number,
    transactionId: string,
  ): Promise<void>

}
