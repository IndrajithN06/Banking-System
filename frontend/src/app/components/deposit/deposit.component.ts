import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css'
})
export class DepositComponent {
  private readonly fb = inject(FormBuilder);
  private readonly accountService = inject(AccountService);
  loading = false;
  message = '';
  error = '';

  form = this.fb.group({ amount: [0, [Validators.required, Validators.min(1)]], description: [''] });

  submit() {
    this.loading = true;
    this.message = '';
    this.error = '';
    const v = this.form.getRawValue();
    this.accountService.deposit(Number(v.amount), v.description || '').subscribe({
      next: res => this.message = `${res.message} New balance: ${res.data.balance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`,
      error: err => this.error = err?.error?.message ?? 'Deposit failed.',
      complete: () => this.loading = false
    });
  }
}
