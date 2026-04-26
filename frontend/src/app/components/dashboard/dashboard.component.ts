import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
  <div class="container py-4">
    <h2>Bank Dashboard</h2>
    <nav class="d-flex gap-2 mb-3">
      <a routerLink="summary" class="btn btn-outline-primary btn-sm">Summary</a>
      <a routerLink="deposit" class="btn btn-outline-success btn-sm">Deposit</a>
      <a routerLink="withdraw" class="btn btn-outline-warning btn-sm">Withdraw</a>
      <a routerLink="transactions" class="btn btn-outline-secondary btn-sm">Transactions</a>
      <button class="btn btn-outline-danger btn-sm" (click)="logout()">Logout</button>
    </nav>
    <router-outlet />
  </div>`
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);
  logout() { this.auth.logout(); }
}
