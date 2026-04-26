export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  accessToken: string;
  expiresAtUtc: string;
  email: string;
  role: string;
}

export interface AccountSummary {
  accountId: number;
  balance: number;
  ownerEmail: string;
}

export interface TransactionItem {
  id: number;
  amount: number;
  type: 'Deposit' | 'Withdraw';
  description: string;
  createdAtUtc: string;
}
