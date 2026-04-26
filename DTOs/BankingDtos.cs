namespace Banking_System.DTOs;

public record MoneyRequest(decimal Amount, string? Description);
public record AccountSummaryResponse(int AccountId, decimal Balance, string OwnerEmail);
public record TransactionResponse(int Id, decimal Amount, string Type, string Description, DateTime CreatedAtUtc);
