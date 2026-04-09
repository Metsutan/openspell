// variable "world_id" {
//   type        = number
//   description = "The unique numerical ID for this world shard (e.g., 1 for Legacy, 2 for Custom)."
// }

// variable "port" {
//   type        = number
//   description = "The static host port the game server will listen on (e.g., 8888)."
// }

// variable "game_image" {
//   type        = string
//   description = "The container image for the game server (e.g., ghcr.io/onizuka/openspell-game:latest)."
// }

// variable "persistence_id" {
//   type        = number
//   description = "The ID used for database persistence logic. Usually matches the world_id."
// }

// variable "max_connections" {
//   type        = number
//   description = "The maximum number of concurrent player connections allowed on this shard."
//   default     = 2
// }

variable "openspell_world" {
  description = "Configuration for the individual game world shard."
  type = object({
    world_id        = number
    port            = number
    persistence_id  = number
    game_image      = string
    max_connections = optional(number, 2)
  })
}