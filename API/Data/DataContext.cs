using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    var dbPath = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "socialapp.db");
        //    optionsBuilder.UseSqlite("Filename = " + dbPath);
        //    base.OnConfiguring(optionsBuilder);
        //}

        public DbSet<AppUser> Users { get; set; }
    }
}