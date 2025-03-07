﻿using System.ComponentModel.DataAnnotations;

namespace DAL.Entities
{
    public class Player
    {
        [Key] public string ConnectionId { get; set; }

        [MaxLength(30)] public string Name { get; set; }

        public Choice Choice { get; set; } = Choice.None;
        public bool IsConnected { get; set; }
        public bool IsReady { get; set; }

        public bool IsActive { get; set; }

        public string GameCode { get; set; }

        public Player(string connectionId)
        {
            ConnectionId = connectionId;
        }
    }
}