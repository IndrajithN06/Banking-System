import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <h4>Deposit</h4>
  <form [formGroup]="form" (ngSubmit)="submit()" class="d-flex gap-2">
    <input class="form-control" type="number" formControlName="amount" placeholder="Amount">
    <input class="form-control" type="text" formControlName="description" placeholder="Description">
    <button class="btn btn-success" [disabled]="loading">{{ loading ? 'Processing...' : 'Deposit' }}</button>
  </form>
  <p class="text-success" *ngIf="message">{{ message }}</p>
  <p class="text-danger" *ngIf="error">{{ error }}</p>`
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
      next: res => this.message = `${res.message} New balance: ${res.data.balance}`,
      error: err => this.error = err?.error?.message ?? 'Deposit failed.',
      complete: () => this.loading = false
    });
  }
}
