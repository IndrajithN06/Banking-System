import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-withdraw',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './withdraw.component.html',
  styleUrl: './withdraw.component.css'
})
export class WithdrawComponent {
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
    this.accountService.withdraw(Number(v.amount), v.description || '').subscribe({
      next: res => this.message = `${res.message} New balance: ${res.data.balance.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`,
      error: err => this.error = err?.error?.message ?? 'Withdraw failed.',
      complete: () => this.loading = false
    });
  }
}
