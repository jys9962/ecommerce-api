export interface AddPointLog {
  type: 'ADD';
  amount: number;
  memo: string;
  expiredAt: Date | null;
  createdAt: Date;
}

export interface UsePointLog {
  type: 'USE';
  amount: number;
  memo: string;
  transactionId: string | null;
  createdAt: Date;
}

export interface RefundPointLog {
  type: 'REFUND';
  amount: number;
  memo: string;
  transactionId: string;
  createdAt: Date;
}

export interface ExpiredPointLog {
  type: 'EXPIRED';
  amount: number;
  memo: string;
  createdAt: Date;
}

export type PointLog =
  AddPointLog |
  UsePointLog |
  RefundPointLog |
  ExpiredPointLog
