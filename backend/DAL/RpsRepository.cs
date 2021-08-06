using System;
using System.Collections.Generic;
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

        public async Task<Game> GetGameAsync(string gameId, bool includePlayers = false)
        {
            if (includePlayers)
            {
                return await _dbContext.Games.Include(game => game.Players)
                    .SingleOrDefaultAsync(game => game.GameCode == gameId);
            }

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

            if (game == null)
                return null;

            if (_dbContext.Players.Any(p => p.ConnectionId == player.ConnectionId))
                return null;

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

        public async Task UpdatePlayersAsync(IEnumerable<Player> players)
        {
            foreach (var player in players)
            {
                _dbContext.Entry(player).State = EntityState.Modified;
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task StartGameAsync(Game game)
        {
            game.IsActive = true;

            _dbContext.Update(game);

            foreach (var player in game.Players)
            {
                player.IsActive = true;

                _dbContext.Update(player);
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteGameAsync(string gameId)
        {
            var game = await GetGameAsync(gameId);

            _dbContext.Remove(game);

            await _dbContext.SaveChangesAsync();
        }

        public async Task<Player> DisconnectPlayerAsync(string playerId)
        {
            var player = await GetPlayerAsync(playerId);

            if (player == null)
            {
                return null;
            }

            _dbContext.Remove(player);
            
            var game = await GetGameAsync(player.GameCode, true);

            // If that was the last player
            if (game.Players.Count <= 1)
            {
                _dbContext.Remove(game);
            }

            await _dbContext.SaveChangesAsync();

            return player;
        }
    }
}