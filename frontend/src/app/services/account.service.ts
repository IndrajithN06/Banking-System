import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiResponse, AccountSummary, TransactionItem } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiBaseUrl}/accounts`;

  summary() {
    return this.http.get<ApiResponse<AccountSummary>>(`${this.base}/summary`);
  }

  deposit(amount: number, description?: string) {
    return this.http.post<ApiResponse<AccountSummary>>(`${this.base}/deposit`, { amount, description });
  }

  withdraw(amount: number, description?: string) {
    return this.http.post<ApiResponse<AccountSummary>>(`${this.base}/withdraw`, { amount, description });
  }

  transactions() {
    return this.http.get<ApiResponse<TransactionItem[]>>(`${this.base}/transactions`);
  }
}
