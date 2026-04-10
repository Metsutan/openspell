variable "worlds" {
  description = "A map of game world shards to deploy. The key is the World ID."
  type = map(object({
    domain          = string
    port            = number
    persistence_id  = number
    game_image      = string
    max_connections = optional(number, 2)
  }))
}