using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL
{
    public interface IRpsRepository
    {
        public Task<Game> GetGameAsync(string gameId);
        public Task<Player> GetPlayerAsync(string playerId);
        public Task<Game> CreateGameAsync(Game game);
        public Task<Player> AddPlayerAsync(string gameId, Player player);
        public Task<Player> UpdatePlayerAsync(Player player);
        public Task DeleteGame(string gameId);
        public Task StartGame(string gameId);
    }
}