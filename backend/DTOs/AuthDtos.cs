namespace Banking_System.DTOs;

public record RegisterRequest(string Name, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string AccessToken, DateTime ExpiresAtUtc, string Email, string Role);
public record ApiResponse<T>(bool Success, string Message, T? Data);
