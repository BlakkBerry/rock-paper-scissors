using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace RpsAPI.Hubs
{
    public class RpsHub : Hub
    {
        public async Task JoinGame(string code)
        {
            await Clients.All.SendAsync("GameJoined");
        }
    }
}