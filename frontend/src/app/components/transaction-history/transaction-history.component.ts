import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  template: `
  <h4>Transaction History</h4>
  <div *ngIf="loading">Loading transactions...</div>
  <p class="text-danger" *ngIf="error">{{ error }}</p>
  <table class="table table-sm" *ngIf="!loading && items.length">
    <thead><tr><th>Date</th><th>Type</th><th>Amount</th><th>Description</th></tr></thead>
    <tbody>
      <tr *ngFor="let item of items">
        <td>{{ item.createdAtUtc | date:'short' }}</td>
        <td>{{ item.type }}</td>
        <td>{{ item.amount | currency }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </tbody>
  </table>`
})
export class TransactionHistoryComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  loading = true;
  error = '';
  items: any[] = [];

  ngOnInit() {
    this.accountService.transactions().subscribe({
      next: res => this.items = res.data,
      error: err => this.error = err?.error?.message ?? 'Unable to load transactions.',
      complete: () => this.loading = false
    });
  }
}
