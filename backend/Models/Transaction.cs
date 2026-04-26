namespace Banking_System.Models;

public class Transaction
{
    public int Id { get; set; }
    public int AccountId { get; set; }
    public decimal Amount { get; set; }
    public string Type { get; set; } = string.Empty; // Deposit / Withdraw
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public Account Account { get; set; } = null!;
}
