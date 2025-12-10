export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
}

export interface Transaction {
  _id?: string;
  id?: string;
  hash: string;
  fromAddress: string;
  toAddress: string;
  amount: string;
  status: TransactionStatus;
  gasLimit?: string;
  gasPrice?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction | Transaction[];
}

export type SortField = 'timestamp' | 'amount' | 'status';
export type SortDirection = 'asc' | 'desc';

export interface TransactionFilters {
  status: TransactionStatus | 'all';
  dateFrom: Date | null;
  dateTo: Date | null;
  search: string;
}

