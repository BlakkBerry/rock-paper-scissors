using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using shortid;
using shortid.Configuration;

namespace DAL.Entities
{
    public class Game
    {
        [Key] public string GameCode { get; set; }

        public bool IsActive { get; set; }

        public ICollection<Player> Players { get; set; } = new List<Player>();

        public Game()
        {
            GameCode = ShortId.Generate(new GenerationOptions
            {
                Length = 8
            });
        } }
}