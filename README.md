# Banking System (ASP.NET Core + Angular)

This repository now includes:
- A **.NET 8 Web API** with JWT auth, CORS setup, and basic banking endpoints.
- An **Angular standalone frontend blueprint** in `frontend/` with routing, guards, interceptor, reusable services, and feature components.

## 1) Recommended architecture

```text
/workspace/Banking-System
├── backend/
│   ├── Controllers/
│   │   ├── AuthController.cs
│   │   └── AccountsController.cs
│   ├── DTOs/
│   │   ├── AuthDtos.cs
│   │   └── BankingDtos.cs
│   ├── Data/
│   │   └── AppDbContext.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Account.cs
│   │   └── Transaction.cs
│   ├── Services/
│   │   ├── ITokenService.cs
│   │   └── TokenService.cs
│   ├── Program.cs
│   └── appsettings.json
└── frontend/
    └── src/app/
        ├── components/
        ├── services/
        ├── models/
        ├── guards/
        └── interceptors/
```

## 2) Backend setup (.NET 8 API)

### Packages
```bash
cd backend
dotnet restore
```

### Run backend
```bash
cd backend
dotnet run
```

Default local swagger URL is typically:
- `https://localhost:7001/swagger`

## 3) Angular setup commands

> If Angular project does not exist yet, run these commands in the repo root:

```bash
npm install -g @angular/cli
ng new banking-frontend --standalone --routing --style=scss
cd banking-frontend
npm install bootstrap @angular/material
```

> For this repo's prepared `frontend/` template:

```bash
cd frontend
npm install
npm start
```

Frontend URL:
- `http://localhost:4200`

## 4) CORS and JWT config

Update `appsettings.json`:
- `Jwt:Key` with a secure key (32+ chars)
- `Cors:AllowedOrigins` with frontend URL(s)

Program config already includes:
- `AddAuthentication().AddJwtBearer(...)`
- `AddCors("AngularClient")`
- `UseCors("AngularClient")`
- `UseAuthentication()` + `UseAuthorization()`

## 5) Authentication flow (end-to-end)

1. User submits Register/Login from Angular.
2. API validates and returns JWT in `ApiResponse<AuthResponse>`.
3. Angular `AuthService` stores token in `localStorage`.
4. `auth.interceptor` adds `Authorization: Bearer <token>`.
5. `auth.guard` blocks protected routes when no token is present.
6. Protected API endpoints (`[Authorize]`) execute only with valid JWT.

## 6) API examples

### Register
`POST /api/auth/register`

Request:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "P@ssw0rd123"
}
```

### Login
`POST /api/auth/login`

### Account summary
`GET /api/accounts/summary` (requires Bearer token)

### Deposit
`POST /api/accounts/deposit`

```json
{
  "amount": 1000,
  "description": "Salary credit"
}
```

### Withdraw
`POST /api/accounts/withdraw`

### Transactions
`GET /api/accounts/transactions`

## 7) Angular integration snippet

```ts
this.http.get<ApiResponse<AccountSummary>>(`${environment.apiBaseUrl}/accounts/summary`)
  .subscribe({
    next: res => this.summary = res.data,
    error: err => this.error = err?.error?.message ?? 'Failed to load account summary.'
  });
```

## 8) Error handling & loading states

All feature components include:
- `loading` boolean for progress UI.
- Friendly `error` message rendering.
- backend response envelope: `ApiResponse<T>`.

## 9) Notes for production readiness

- Replace SHA256 password hashing with **ASP.NET Core Identity PasswordHasher** or BCrypt/Argon2.
- Add refresh tokens, revoke/logout strategy, audit logging.
- Add role policies (`AddAuthorization(options => ...)`) for admin features.
- Move secrets to environment variables / Azure Key Vault.
- Add validation pipeline and global exception middleware.

## 10) Run frontend + backend together

Terminal 1:
```bash
cd /workspace/Banking-System/backend
dotnet run
```

Terminal 2:
```bash
cd /workspace/Banking-System/frontend
npm install
npm start
```
