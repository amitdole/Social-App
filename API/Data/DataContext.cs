using API.Converters;
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

        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            builder.Properties<DateOnly>().HaveConversion<DateOnlyConverter>().HaveColumnType("date");
            base.ConfigureConventions(builder);
        }
    }
}