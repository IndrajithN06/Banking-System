import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="loading">Loading account...</div>
  <div *ngIf="error" class="text-danger">{{ error }}</div>
  <div *ngIf="summary">
    <h4>Account #{{ summary.accountId }}</h4>
    <p><strong>Owner:</strong> {{ summary.ownerEmail }}</p>
    <p><strong>Balance:</strong> {{ summary.balance | currency }}</p>
  </div>`
})
export class AccountSummaryComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  loading = true;
  error = '';
  summary: any;

  ngOnInit() {
    this.accountService.summary().subscribe({
      next: res => this.summary = res.data,
      error: err => this.error = err?.error?.message ?? 'Failed to load summary.',
      complete: () => this.loading = false
    });
  }
}
