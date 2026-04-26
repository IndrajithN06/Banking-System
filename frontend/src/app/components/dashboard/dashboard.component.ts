import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <main class="dashboard-shell">
    <header class="dashboard-header">
      <div>
        <p class="eyebrow">Banking System</p>
        <h1>Financial Dashboard</h1>
      </div>
      <button class="logout" (click)="logout()">Logout</button>
    </header>

    <nav class="dashboard-nav">
      <a routerLink="summary" routerLinkActive="active">Account Summary</a>
      <a routerLink="deposit" routerLinkActive="active">Deposit Funds</a>
      <a routerLink="withdraw" routerLinkActive="active">Withdraw Funds</a>
      <a routerLink="transactions" routerLinkActive="active">Transactions</a>
    </nav>

    <section class="dashboard-content">
      <router-outlet />
    </section>
  </main>`,
  styles: [`
    :host { display: block; }
    .dashboard-shell {
      max-width: 1080px;
      margin: 0 auto;
      padding: 2rem 1rem 2.5rem;
    }
    .dashboard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .eyebrow { margin: 0; color: #1d4ed8; font-weight: 700; }
    h1 { margin: .25rem 0 0; }
    .logout {
      border: 1px solid #fca5a5;
      background: #fff1f2;
      color: #be123c;
      border-radius: 999px;
      padding: .55rem 1rem;
      font-weight: 600;
      cursor: pointer;
    }
    .dashboard-nav {
      display: flex;
      flex-wrap: wrap;
      gap: .75rem;
      margin-bottom: 1rem;
    }
    .dashboard-nav a {
      text-decoration: none;
      border-radius: 999px;
      padding: .55rem .95rem;
      color: #1f2937;
      background: #ffffff;
      border: 1px solid #dbeafe;
      font-weight: 600;
    }
    .dashboard-nav a.active {
      background: linear-gradient(120deg, #2563eb, #7c3aed);
      color: #fff;
      border-color: transparent;
    }
    .dashboard-content {
      background: rgba(255, 255, 255, .9);
      border: 1px solid #e5e7eb;
      border-radius: 20px;
      padding: 1.2rem;
      box-shadow: 0 10px 35px rgba(15, 23, 42, .08);
    }
  `]
})
export class DashboardComponent {
  private readonly auth = inject(AuthService);

  logout() {
    this.auth.logout();
  }
}
