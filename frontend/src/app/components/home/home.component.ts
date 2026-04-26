import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
  <section class="home">
    <div class="hero-card">
      <p class="eyebrow">Modern Banking UI</p>
      <h1>Simple, secure, and beautiful money management.</h1>
      <p class="subtext">
        Access your account summary, track transaction history, and move funds in just a few clicks.
      </p>
      <div class="actions">
        <a routerLink="/register" class="primary">Create Account</a>
        <a routerLink="/login" class="ghost">Login</a>
      </div>
      <div class="stats">
        <article><strong>24/7</strong><span>Account Access</span></article>
        <article><strong>Fast</strong><span>Transfers</span></article>
        <article><strong>Secure</strong><span>Authentication</span></article>
      </div>
    </div>
  </section>
  `,
  styles: [`
    :host { display: block; }
    .home {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 2rem 1rem;
    }
    .hero-card {
      width: min(960px, 100%);
      background: linear-gradient(145deg, rgba(255, 255, 255, .95), rgba(241, 245, 249, .9));
      border: 1px solid rgba(255, 255, 255, .7);
      border-radius: 28px;
      padding: clamp(1.5rem, 4vw, 3rem);
      box-shadow: 0 35px 70px rgba(37, 99, 235, .2);
    }
    .eyebrow { margin: 0; font-size: .9rem; font-weight: 700; letter-spacing: .08em; color: #2563eb; text-transform: uppercase; }
    h1 { font-size: clamp(1.8rem, 4vw, 3rem); margin: .4rem 0; line-height: 1.15; }
    .subtext { color: #4b5563; max-width: 60ch; }
    .actions { display: flex; gap: .8rem; margin: 1.25rem 0 1.5rem; flex-wrap: wrap; }
    .actions a { text-decoration: none; font-weight: 700; border-radius: 999px; padding: .75rem 1.2rem; }
    .primary { color: #fff; background: linear-gradient(120deg, #2563eb, #7c3aed); }
    .ghost { color: #1e3a8a; background: #dbeafe; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .75rem; }
    article { padding: .85rem; border-radius: 14px; background: rgba(255, 255, 255, .95); border: 1px solid #e5e7eb; }
    strong { display: block; font-size: 1.15rem; color: #0f172a; }
    span { color: #64748b; }
  `]
})
export class HomeComponent {}
