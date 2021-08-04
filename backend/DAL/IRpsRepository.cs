using System.Collections.Generic;
using System.Threading.Tasks;
using DAL.Entities;

namespace DAL
{
    public interface IRpsRepository
    {
        public Task<Game> GetGameAsync(string gameId, bool includePlayers = false);
        public Task<Player> GetPlayerAsync(string playerId);
        // public Task<Game> GetGameForPlayerAsync(string playerId, bool includePlayers = false);
        public Task<Game> CreateGameAsync(Game game);
        public Task<Player> AddPlayerAsync(string gameId, Player player);
        public Task<Player> UpdatePlayerAsync(Player player);
        public Task UpdatePlayersAsync(IEnumerable<Player> players);
        public Task DeleteGameAsync(string gameId);
        public Task<Player> DisconnectPlayerAsync(string playerId);
        public Task StartGameAsync(Game game);
    }
}