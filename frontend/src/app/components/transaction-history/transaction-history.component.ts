import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
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
