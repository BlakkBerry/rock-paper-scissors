using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
    public class RpsDbContext : DbContext
    {
        public RpsDbContext(DbContextOptions<RpsDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Player>()
                .HasOne<Game>()
                .WithMany(p => p.Players)
                .HasForeignKey(p => p.GameCode)
                .OnDelete(DeleteBehavior.Cascade);
        }

        public DbSet<Game> Games { get; set; }
        public DbSet<Player> Players { get; set; }
    }
}