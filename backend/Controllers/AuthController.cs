using Banking_System.Data;
using Banking_System.DTOs;
using Banking_System.Models;
using Banking_System.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace Banking_System.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(AppDbContext dbContext, ITokenService tokenService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register(RegisterRequest request)
    {
        if (await dbContext.Users.AnyAsync(u => u.Email == request.Email))
        {
            return Conflict(new ApiResponse<AuthResponse>(false, "Email already exists.", null));
        }

        var user = new User
        {
            Name = request.Name,
            Email = request.Email.Trim().ToLowerInvariant(),
            PasswordHash = HashPassword(request.Password),
            Role = "Customer"
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        dbContext.Accounts.Add(new Account { UserId = user.Id, Balance = 0 });
        await dbContext.SaveChangesAsync();

        var token = tokenService.GenerateAccessToken(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(60);
        return Ok(new ApiResponse<AuthResponse>(true, "Registration successful.", new AuthResponse(token, expiresAt, user.Email, user.Role)));
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user is null || user.PasswordHash != HashPassword(request.Password))
        {
            return Unauthorized(new ApiResponse<AuthResponse>(false, "Invalid credentials.", null));
        }

        var token = tokenService.GenerateAccessToken(user);
        var expiresAt = DateTime.UtcNow.AddMinutes(60);
        return Ok(new ApiResponse<AuthResponse>(true, "Login successful.", new AuthResponse(token, expiresAt, user.Email, user.Role)));
    }

    private static string HashPassword(string password)
    {
        var bytes = SHA256.HashData(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(bytes);
    }
}
