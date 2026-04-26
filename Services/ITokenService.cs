using Banking_System.Models;

namespace Banking_System.Services;

public interface ITokenService
{
    string GenerateAccessToken(User user);
}
