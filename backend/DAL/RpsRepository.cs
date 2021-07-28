using System;
using System.Linq;
using System.Threading.Tasks;
using DAL.Entities;
using Microsoft.EntityFrameworkCore;

namespace DAL
{
    public class RpsRepository : IRpsRepository
    {
        private readonly RpsDbContext _dbContext;

        public RpsRepository(RpsDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Game> GetGameAsync(string gameId)
        {
            return await _dbContext.Games.FindAsync(gameId);
        }

        public async Task<Player> GetPlayerAsync(string playerId)
        {
            return await _dbContext.Players.FindAsync(playerId);
        }

        public async Task<Game> CreateGameAsync(Game game)
        {
            await _dbContext.AddAsync(game);
            await _dbContext.SaveChangesAsync();

            return game;
        }

        public async Task<Player> AddPlayerAsync(string gameId, Player player)
        {
            var game = await GetGameAsync(gameId);

            game.Players.Add(player);

            await _dbContext.SaveChangesAsync();

            return player;
        }

        public async Task<Player> UpdatePlayerAsync(Player player)
        {
            _dbContext.Players.Update(player);

            await _dbContext.SaveChangesAsync();

            return player;
        }

        public async Task StartGame(string gameId)
        {
            var game = await GetGameAsync(gameId);

            game.IsActive = true;

            _dbContext.Update(game);

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteGame(string gameId)
        {
            var game = await GetGameAsync(gameId);

            _dbContext.Remove(game);

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeletePlayer(string playerId)
        {
            var player = await GetPlayerAsync(playerId);

            _dbContext.Remove(playerId);

            await _dbContext.SaveChangesAsync();
        }
    }
}