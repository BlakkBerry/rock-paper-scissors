using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
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
            if (player.ConnectionId == null)
            {
                player.ConnectionId = shortid.ShortId.Generate(new GenerationOptions {Length = 12});
            }

            return await _repository.AddPlayerAsync(gameId, player);
        }

        [HttpDelete("{gameId}")]
        public async Task DeleteGame(string gameId)
        {
            await _repository.DeleteGameAsync(gameId);
        }

        [HttpPatch("players/{playerId}")]
        public async Task<ActionResult<Player>> UpdateGame(string playerId)
        {
            var player = await _repository.GetPlayerAsync(playerId);

            if (player == null)
            {
                return new NotFoundResult();
            }

            player.Choice = Choice.Rock;
            player.IsReady = true;

            return await _repository.UpdatePlayerAsync(player);
        }

        [HttpGet("players/{playerId}")]
        public async Task<Player> GetPlayer(string playerId)
        {
            return await _repository.GetPlayerAsync(playerId);
        }

        [HttpGet("{gameId}")]
        public async Task<IEnumerable<Player>> GetPlayers(string gameId)
        {
            var game = await _repository.GetGameAsync(gameId);

            return game.Players;
        }

        [HttpGet("pg/{playerId}")]
        public async Task<Game> GetGameForPlayer(string playerId)
        {
            var player = await _repository.GetPlayerAsync(playerId);
            var game = await _repository.GetGameAsync(player.GameCode);

            return game;
        }

        [HttpPost("start/{gameId}")]
        public async Task<Game> StartGame(string gameId)
        {

            var game = await _repository.GetGameAsync(gameId, true);
            
            if (game.Players.Count < 2)
            {
                Console.WriteLine("There must be at least 2 players in the game.");
                return null;
            }

            if (game.Players.Any(player => !player.IsReady))
            {
                Console.WriteLine("Not all players are ready in this game.");
                return null;
            }

            await _repository.StartGameAsync(game);

            return game;
        }
    }
}