import { StockDto } from '@libs/features/stock/api/stock.dto'

export abstract class StockApi {

  /**
   * 재고량 조회
   */
  abstract get(
    code: string[],
  ): Promise<StockDto[]>

  /**
   * 재고량 수정 (음수/양수)
   */
  abstract update(
    code: string,
    quantity: number,
  ): Promise<StockDto[]>

  /**
   * 재고량 설정 (현재값 무시)
   */
  abstract set(
    code: string,
    quantity: number,
  ): Promise<void>

  /**
   * 등록된 상품 코드에 대한 재고 정보 삭제
   */
  abstract delete(
    code: string[],
  ): Promise<void>

}
