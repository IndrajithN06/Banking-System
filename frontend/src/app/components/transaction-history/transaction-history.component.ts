import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { TransactionItem } from '../../models/api.models';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-history.component.html',
  styleUrl: './transaction-history.component.css'
})
export class TransactionHistoryComponent implements OnInit {
  private readonly accountService = inject(AccountService);
  loading = true;
  error = '';
  items: TransactionItem[] = [];
  typeFilter: 'All' | TransactionItem['type'] = 'All';
  fromDate = '';
  toDate = '';
  minAmount: number | null = null;
  maxAmount: number | null = null;

  get filteredItems() {
    return this.items.filter(item => {
      const itemDate = new Date(item.createdAtUtc);
      const fromDate = this.fromDate ? new Date(`${this.fromDate}T00:00:00`) : null;
      const toDate = this.toDate ? new Date(`${this.toDate}T23:59:59`) : null;
      const matchesType = this.typeFilter === 'All' || item.type === this.typeFilter;
      const matchesFromDate = !fromDate || itemDate >= fromDate;
      const matchesToDate = !toDate || itemDate <= toDate;
      const matchesMinAmount = this.minAmount === null || item.amount >= this.minAmount;
      const matchesMaxAmount = this.maxAmount === null || item.amount <= this.maxAmount;

      return matchesType && matchesFromDate && matchesToDate && matchesMinAmount && matchesMaxAmount;
    });
  }

  get totalDeposits() {
    return this.filteredItems
      .filter(item => item.type === 'Deposit')
      .reduce((total, item) => total + item.amount, 0);
  }

  get totalWithdrawals() {
    return this.filteredItems
      .filter(item => item.type === 'Withdraw')
      .reduce((total, item) => total + item.amount, 0);
  }

  get netMovement() {
    return this.totalDeposits - this.totalWithdrawals;
  }

  ngOnInit() {
    this.accountService.transactions().subscribe({
      next: res => this.items = res.data,
      error: err => this.error = err?.error?.message ?? 'Unable to load transactions.',
      complete: () => this.loading = false
    });
  }

  clearFilters() {
    this.typeFilter = 'All';
    this.fromDate = '';
    this.toDate = '';
    this.minAmount = null;
    this.maxAmount = null;
  }

  exportCsv() {
    const header = ['Date', 'Type', 'Amount', 'Description'];
    const rows = this.filteredItems.map(item => [
      new Date(item.createdAtUtc).toLocaleString(),
      item.type,
      item.amount.toString(),
      item.description || 'No description'
    ]);
    const csv = [header, ...rows]
      .map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mini-statement.csv';
    link.click();
    URL.revokeObjectURL(url);
  }
}
