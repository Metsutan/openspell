variable "image_registry" {
  description = "Base container registry for world game servers"
  type        = string
  default     = "ghcr.io/metsutan/openspell"
}

variable "image_tag" {
  description = "Default image tag for world game servers"
  type        = string
  default     = "latest"
}

variable "worlds" {
  description = "A map of game world shards to deploy. The key is the World ID."
  type = map(object({
    domain          = string
    port            = number
    persistence_id  = number
    game_image      = optional(string, "")
    image_registry  = optional(string, "")
    image_tag       = optional(string, "")
    max_connections = optional(number, 2)
    force_pull      = optional(bool, false)
  }))
}