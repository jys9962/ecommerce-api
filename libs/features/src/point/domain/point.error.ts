// 포인트 부족
type NotEnough = 'not_enough'

// 주문번호 이력 없음
type TransactionNotFound = 'transaction_not_found'

// 사용한 포인트가 환불하려는 포인트보다 적음
type NotEnoughToRefund = 'not_enough_to_refund'

export type UsePointError =
  NotEnough;

export type RefundPointError =
  TransactionNotFound |
  NotEnoughToRefund;
