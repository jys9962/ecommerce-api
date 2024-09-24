import { PointAmount } from '@libs/features/point/domain/types/point-amount';
import { PointAddedDetail } from '@libs/features/point/domain/internal/detail/point-added-detail';

export interface PointDetail {
  id: string;
  amount: PointAmount;
  addedDetail: PointAddedDetail;

  transactionId: string | undefined;
  signedAmount: number;
}
