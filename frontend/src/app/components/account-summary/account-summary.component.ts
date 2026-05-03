import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-account-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account-summary.component.html',
  styleUrl: './account-summary.component.css'
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
