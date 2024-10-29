export interface AddPointLog {
  type: 'ADD';
  point: number;
  memo: string;
  expiredAt: Date | null;
  createdAt: Date;
}

export interface UsePointLog {
  type: 'USE';
  point: number;
  memo: string;
  transactionId: string;
  createdAt: Date;
}

export interface RefundPointLog {
  type: 'REFUND';
  point: number;
  memo: string;
  transactionId: string;
  createdAt: Date;
}

export interface ExpiredPointLog {
  type: 'EXPIRED';
  point: number;
  memo: string;
  createdAt: Date;
}

export type PointLog =
  AddPointLog |
  UsePointLog |
  RefundPointLog |
  ExpiredPointLog
