// 포인트 부족
type NotEnough = 'point_not_enough'

// 사용한 포인트가 환불하려는 포인트보다 적음
type NotEnoughToRefund = 'not_enough_to_refund'

export type UsePointError =
  NotEnough;

export type RefundPointError =
  NotEnoughToRefund;
