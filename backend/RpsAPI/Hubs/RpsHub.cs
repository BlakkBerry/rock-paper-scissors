using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace RpsAPI.Hubs
{
    public class RpsHub : Hub
    {
        // private static readonly GameManager GameManager = new();
        //
        // public async Task CreateGame()
        // {
        //     var code = GameManager.Create();
        //
        //     await Clients.Caller.SendAsync("GameCreated", code);
        // }
        //
        // public async Task JoinGame(string code)
        // {
        //     if (!GameManager.TryJoin(code, new Player(Context.ConnectionId)))
        //     {
        //         await Clients.Caller.SendAsync("ReceiveError", "Cannot join this game.");
        //         return;
        //     }
        //
        //     await Groups.AddToGroupAsync(Context.ConnectionId, code);
        //     await Clients.Caller.SendAsync("GameJoined");
        // }
        //
        // public async Task SetUsername(string code, string name)
        // {
        //     var player = GameManager.GetPlayer(code, Context.ConnectionId);
        //     var game = GameManager.GetGame(code);
        //
        //     var usernames = game.Players.Select(p => p.Username);
        //
        //     if (usernames.Contains(name))
        //     {
        //         await Clients.Caller.SendAsync("ReceiveError", "User is already in the game.");
        //         return;
        //     }
        //
        //     player.Username = name;
        //
        //     await Clients.OthersInGroup(code).SendAsync("PlayerJoined", name);
        //     await Clients.Caller.SendAsync("LobbyJoined", usernames);
        // }
        //
        // public async Task SetIsReady(string code, bool isReady)
        // {
        //     var player = GameManager.GetPlayer(code, Context.ConnectionId);
        //
        //     player.IsReady = isReady;
        //
        //     await Clients.OthersInGroup(code).SendAsync("PlayerIsReady", player.Username, isReady);
        // }
        //
        // public async Task StartGame(string code)
        // {
        //     var players = GameManager.GetGame(code).Players;
        //
        //     if (players.Count < 2)
        //     {
        //         await Clients.Caller.SendAsync("ReceiveError", "There must be at least 2 players in the game.");
        //         return;
        //     }
        //
        //     foreach (var player in players)
        //         player.IsPlaying = true;
        // }
        //
        // public async Task Vote(string code, string choice)
        // {
        //     var player = GameManager.GetPlayer(code, Context.ConnectionId);
        //
        //     if (!player.IsPlaying || player.Choice != null)
        //         return;
        //
        //     player.Choice = choice;
        //
        //     var playersInGroup = GameManager.GetGame(code).Players;
        //     var activePlayersCount = playersInGroup.Count(p => p.IsPlaying);
        //     var chosePlayersCount = playersInGroup.Count(p => p.Choice != null);
        //
        //     if (activePlayersCount == chosePlayersCount)
        //     {
        //         var votes = playersInGroup.Where(p => p.Choice != null).Select(p => new
        //         {
        //             Choice = p.Choice,
        //             Username = p.Username
        //         });
        //         await Clients.Group(code).SendAsync("AllVoted", votes);
        //     }
        // }
        //
        // public override Task OnDisconnectedAsync(Exception? exception)
        // {
        //     var (code, player) = GameManager.GetPlayer(Context.ConnectionId);
        //     GameManager.Leave(code, player);
        //
        //     return Task.CompletedTask;
        // }
    }
}