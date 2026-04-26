using Banking_System.Data;
using Banking_System.DTOs;
using Banking_System.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Banking_System.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccountsController(AppDbContext dbContext) : ControllerBase
{
    [HttpGet("summary")]
    public async Task<ActionResult<ApiResponse<AccountSummaryResponse>>> Summary()
    {
        var userId = GetUserId();
        var account = await dbContext.Accounts
            .Include(a => a.User)
            .SingleOrDefaultAsync(a => a.UserId == userId);

        if (account is null)
        {
            return NotFound(new ApiResponse<AccountSummaryResponse>(false, "Account not found.", null));
        }

        var data = new AccountSummaryResponse(account.Id, account.Balance, account.User.Email);
        return Ok(new ApiResponse<AccountSummaryResponse>(true, "Account summary fetched.", data));
    }

    [HttpPost("deposit")]
    public async Task<ActionResult<ApiResponse<AccountSummaryResponse>>> Deposit(MoneyRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest(new ApiResponse<AccountSummaryResponse>(false, "Amount must be greater than zero.", null));
        }

        var account = await GetCurrentAccount();
        if (account is null)
        {
            return NotFound(new ApiResponse<AccountSummaryResponse>(false, "Account not found.", null));
        }

        account.Balance += request.Amount;
        dbContext.Transactions.Add(new Transaction
        {
            AccountId = account.Id,
            Amount = request.Amount,
            Type = "Deposit",
            Description = request.Description ?? "User deposit"
        });

        await dbContext.SaveChangesAsync();
        var data = new AccountSummaryResponse(account.Id, account.Balance, account.User.Email);
        return Ok(new ApiResponse<AccountSummaryResponse>(true, "Deposit successful.", data));
    }

    [HttpPost("withdraw")]
    public async Task<ActionResult<ApiResponse<AccountSummaryResponse>>> Withdraw(MoneyRequest request)
    {
        if (request.Amount <= 0)
        {
            return BadRequest(new ApiResponse<AccountSummaryResponse>(false, "Amount must be greater than zero.", null));
        }

        var account = await GetCurrentAccount();
        if (account is null)
        {
            return NotFound(new ApiResponse<AccountSummaryResponse>(false, "Account not found.", null));
        }

        if (account.Balance < request.Amount)
        {
            return BadRequest(new ApiResponse<AccountSummaryResponse>(false, "Insufficient balance.", null));
        }

        account.Balance -= request.Amount;
        dbContext.Transactions.Add(new Transaction
        {
            AccountId = account.Id,
            Amount = request.Amount,
            Type = "Withdraw",
            Description = request.Description ?? "User withdrawal"
        });

        await dbContext.SaveChangesAsync();
        var data = new AccountSummaryResponse(account.Id, account.Balance, account.User.Email);
        return Ok(new ApiResponse<AccountSummaryResponse>(true, "Withdrawal successful.", data));
    }

    [HttpGet("transactions")]
    public async Task<ActionResult<ApiResponse<List<TransactionResponse>>>> Transactions()
    {
        var account = await GetCurrentAccount();
        if (account is null)
        {
            return NotFound(new ApiResponse<List<TransactionResponse>>(false, "Account not found.", null));
        }

        var transactions = await dbContext.Transactions
            .Where(t => t.AccountId == account.Id)
            .OrderByDescending(t => t.CreatedAtUtc)
            .Select(t => new TransactionResponse(t.Id, t.Amount, t.Type, t.Description, t.CreatedAtUtc))
            .ToListAsync();

        return Ok(new ApiResponse<List<TransactionResponse>>(true, "Transactions fetched.", transactions));
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue(ClaimTypes.Name) ?? User.FindFirstValue(ClaimTypes.Email);
        if (int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return userId;
        }

        var subClaim = User.FindFirstValue("sub");
        if (int.TryParse(subClaim, out userId))
        {
            return userId;
        }

        throw new UnauthorizedAccessException("Invalid token claims.");
    }

    private async Task<Account?> GetCurrentAccount()
    {
        var userId = GetUserId();
        return await dbContext.Accounts.Include(a => a.User).SingleOrDefaultAsync(a => a.UserId == userId);
    }
}
