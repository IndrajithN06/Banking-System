    using Microsoft.EntityFrameworkCore;
    using Banking_System.Models;

    namespace Banking_System.Data {
        public class AppDbContext:DbContext
        {

            public AppDbContext(DbContextOptions<AppDbContext> options):base (options)
            {

            }
            public DbSet<User> Users { get; set; }
        }

    }