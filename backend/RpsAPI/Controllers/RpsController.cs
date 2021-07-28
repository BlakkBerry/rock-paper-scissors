using System;
using System.Threading.Tasks;
using DAL;
using DAL.Entities;
using Microsoft.AspNetCore.Mvc;
using shortid.Configuration;

namespace RpsAPI.Controllers
{
    [ApiController]
    [Route("api/rps")]
    public class RpsController
    {
        private readonly IRpsRepository _repository;

        public RpsController(IRpsRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        public async Task<Game> CreateGame()
        {
            var game = new Game();
            return await _repository.CreateGameAsync(game);
        }

        [HttpPost("{gameId}")]
        public async Task<Player> CreatePlayer(string gameId, [FromBody] Player player)
        {
            player.ConnectionId = shortid.ShortId.Generate(new GenerationOptions {Length = 12});
            return await _repository.AddPlayerAsync(gameId, player);
        }

        [HttpDelete("{gameId}")]
        public async Task DeleteGame(string gameId)
        {
            await _repository.DeleteGame(gameId);
        }

        [HttpPut("{gameId}")]
        public async Task StartGame(string gameId)
        {
            await _repository.StartGame(gameId);
        }

        [HttpPatch("players/{playerId}")]
        public async Task<Player> UpdateGame(string playerId)
        {
            var player = await _repository.GetPlayerAsync(playerId);
            player.Choice = Choice.Rock;
            player.IsReady = true;

            return await _repository.UpdatePlayerAsync(player);
        }
        
        [HttpGet("players/{playerId}")]
        public async Task<Player> GetPlayer(string playerId)
        {
            return await _repository.GetPlayerAsync(playerId);
        }
    }
}