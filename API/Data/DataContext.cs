using API.Converters;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Security.Principal;

namespace API.Data
{
    public class DataContext : IdentityDbContext<AppUser, AppRole, int,
        IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>,
        IdentityRoleClaim<int>, IdentityUserToken<int>>
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

        public DbSet<UserLike> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasMany(u => u.UserRoles)
                .WithOne(u => u.User)
                .HasForeignKey(u => u.UserId)
                .IsRequired();

            modelBuilder.Entity<AppRole>()
               .HasMany(u => u.UserRoles)
               .WithOne(u => u.Role)
               .HasForeignKey(u => u.RoleId)
               .IsRequired();

            modelBuilder.Entity<UserLike>().
                HasKey(k => new { k.SourceUserId, k.TargetUserId });

            modelBuilder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LinkedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserLike>()
              .HasOne(s => s.TargetUser)
              .WithMany(l => l.LinkedByUsers)
              .HasForeignKey(s => s.TargetUserId)
              .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Message>()
             .HasOne(u => u.Recipient)
             .WithMany(u => u.MessagesReceived)
             .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(m => m.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);
        }

        protected override void ConfigureConventions(ModelConfigurationBuilder builder)
        {
            builder.Properties<DateOnly>().HaveConversion<DateOnlyConverter>().HaveColumnType("date");
            base.ConfigureConventions(builder);
        }
    }
}