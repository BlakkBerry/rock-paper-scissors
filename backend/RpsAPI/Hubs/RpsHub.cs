using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DAL;
using DAL.Entities;
using Microsoft.AspNetCore.SignalR;

namespace RpsAPI.Hubs
{
    public class RpsHub : Hub
    {
        private readonly IRpsRepository _repository;

        public RpsHub(IRpsRepository repository)
        {
            _repository = repository;
        }

        public async Task CreateGame()
        {
            var game = await _repository.CreateGameAsync(new Game());

            await Clients.Caller.SendAsync("GameCreated", game.GameCode);
        }

        public async Task JoinGame(string gameCode)
        {
            var player = await _repository.AddPlayerAsync(gameCode, new Player(Context.ConnectionId));

            if (player == null)
            {
                await Clients.Caller.SendAsync("ReceiveError",
                    $"No game was found with code: {gameCode}");
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, gameCode);
            await Clients.Caller.SendAsync("GameJoined", gameCode, Context.ConnectionId);
        }

        public async Task SetUsername(string playerName)
        {
            if (playerName.Length == 0)
            {
                await Clients.Caller.SendAsync("ReceiveError", "Username can't be empty.");
                return;
            }

            var player = await _repository.GetPlayerAsync(Context.ConnectionId);
            var game = await _repository.GetGameAsync(player.GameCode, true);

            if (game == null)
            {
                await Clients.Caller.SendAsync("ReceiveError", "User is not connected to any game.");
                return;
            }

            if (game.Players.Select(p => p.Name).Any(name => name == playerName))
            {
                await Clients.Caller.SendAsync("ReceiveError", "User is already in the game.");
                return;
            }

            player.Name = playerName;

            await _repository.UpdatePlayerAsync(player);

            await Clients.OthersInGroup(game.GameCode).SendAsync("PlayerJoined", player);
            await Clients.Caller.SendAsync("LobbyJoined", game.Players, player);
        }

        public async Task SetIsReady(bool isReady)
        {
            var player = await _repository.GetPlayerAsync(Context.ConnectionId);

            player.IsReady = isReady;

            await _repository.UpdatePlayerAsync(player);

            await Clients.OthersInGroup(player.GameCode).SendAsync("PlayerIsReady", player.ConnectionId, isReady);
        }

        public async Task StartGame()
        {
            var player = await _repository.GetPlayerAsync(Context.ConnectionId);
            var game = await _repository.GetGameAsync(player.GameCode, true);

            if (game.Players.Count < 2)
            {
                await Clients.Caller.SendAsync("ReceiveError", "There must be at least 2 players in the game.");
                return;
            }

            if (game.Players.Any(p => !p.IsReady))
            {
                await Clients.Caller.SendAsync("ReceiveError", "Not all players are ready in this game.");
                return;
            }

            await _repository.StartGameAsync(game);

            await Clients.Group(game.GameCode).SendAsync("GameStarted");
        }

        public async Task Vote(int choice)
        {
            var option = (Choice) choice;

            if (!Enum.IsDefined(typeof(Choice), option) || option == Choice.None)
            {
                await Clients.Caller.SendAsync("ReceiveError", "Wrong choice type.");
                return;
            }

            var player = await _repository.GetPlayerAsync(Context.ConnectionId);

            if (!player.IsActive || player.Choice != Choice.None)
            {
                await Clients.Caller.SendAsync("ReceiveError", "You cannot vote right now.");
                return;
            }

            player.Choice = option;

            await _repository.UpdatePlayerAsync(player);

            var game = await _repository.GetGameAsync(player.GameCode, true);
            var readyPlayers = game.Players.Where(p => p.IsActive && p.Choice != Choice.None).ToList();

            if (game.Players.Count(p => p.IsActive) == readyPlayers.Count)
            {
                await CheckResults(game, readyPlayers);
            }
        }

        private async Task CheckResults(Game game, List<Player> players)
        {
            var choices = players.Select(p => p.Choice).ToList();

            if (choices.All(c => c is Choice.Rock) ||
                choices.All(c => c is Choice.Paper) ||
                choices.All(c => c is Choice.Scissors))
            {
                await Clients.Group(game.GameCode).SendAsync("Draw", players);
                await RestartRound();
                return;
            }

            var withRock = choices.Contains(Choice.Rock);
            var withPaper = choices.Contains(Choice.Paper);
            var withScissors = choices.Contains(Choice.Scissors);

            if (withRock && withPaper && withScissors)
            {
                await Clients.Group(game.GameCode).SendAsync("Draw", players);
                await RestartRound();
                return;
            }

            IEnumerable<Player> winners;

            // paper + scissors
            if (!withRock)
            {
                winners = players.Where(p => p.Choice == Choice.Scissors).ToList();
            }

            // rock + scissors
            else if (!withPaper)
            {
                winners = players.Where(p => p.Choice == Choice.Rock).ToList();
            }

            // rock + paper
            else
            {
                winners = players.Where(p => p.Choice == Choice.Paper).ToList();
            }

            if (winners.Count() == 1)
            {
                await Clients.Group(game.GameCode)
                    .SendAsync("GameFinished", players, winners.Select(p => p.ConnectionId).First());
                await _repository.DeleteGameAsync(game.GameCode);
            }
            else
            {
                await Clients.Group(game.GameCode)
                    .SendAsync("RoundFinished", players, winners.Select(p => p.ConnectionId));

                var losers = players.Except(winners).ToList();
                await RestartRound(losers);
            }
        }

        private async Task RestartRound(ICollection<Player> losers = null)
        {
            var player = await _repository.GetPlayerAsync(Context.ConnectionId);
            var game = await _repository.GetGameAsync(player.GameCode);

            foreach (var p in game.Players)
            {
                p.Choice = Choice.None;

                if (losers != null && losers.Contains(p))
                {
                    p.IsActive = false;
                }
            }

            await _repository.UpdatePlayersAsync(game.Players);
        }

        public async Task GetConnectionId()
        {
            await Clients.Caller.SendAsync("ReceiveConnectionId", Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var player = await _repository.DisconnectPlayerAsync(Context.ConnectionId);

            if (player != null)
            {
                await Clients.OthersInGroup(player.GameCode).SendAsync("PlayerDisconnected", player.ConnectionId);
            }
        }
    }
}