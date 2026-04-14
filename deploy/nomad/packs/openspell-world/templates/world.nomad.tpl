job "openspell-worlds" {
  datacenters = ["dc1"]
  type        = "service"

  # Loop through every world defined in the pkrvars file
  [[- range $world_id, $world := var "worlds" . ]]

  group "game-server-[[ $world_id ]]" {
    network {
      mode = "bridge"
      port "game" {
        static = [[ $world.port ]]
      }
    }

    volume "game_logs" {
      type      = "host"
      source    = "game_logs"
      read_only = false
    }

    service {
      name     = "openspell-game-[[ $world_id ]]"
      port     = "game"
      provider = "consul"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "openspell-api"
              local_bind_port  = 3002
            }
            upstreams {
              destination_name = "openspell-postgres"
              local_bind_port  = 5432
            }
            upstreams {
              destination_name = "openspell-redis"
              local_bind_port  = 6379
            }
          }
        }
      }
    }

    task "wait-for-api" {
      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
      driver = "podman"
      config {
        image   = "docker.io/curlimages/curl:latest"
        command = "/bin/sh"
        args    = ["-c", "until curl -s http://127.0.0.1:3002/health > /dev/null; do echo 'Waiting...'; sleep 2; done"]
      }
    }

    task "prepare-logs" {
      lifecycle {
        hook    = "prestart"
        sidecar = false
      }
      driver = "exec"
      config {
        command = "mkdir"
        args    = ["-p", "/opt/openspell/data/logs/world-[[ $world_id ]]"]
      }
    }

    task "game" {
      driver = "podman"
      kill_signal = "SIGUSR1"
      kill_timeout = "7m"
      config {
        image = "[[ $world.game_image ]]"
        ports = ["game"]
        force_pull = true
      }

      volume_mount { # 
        volume      = "game_logs"
        destination = "/data/game-logs"
        read_only   = false
      }

      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-core" -}}
NODE_ENV="production"
SERVER_ID="[[ $world_id ]]"
PERSISTENCE_ID="[[ $world.persistence_id ]]"
MAX_CONNECTIONS="[[ $world.max_connections ]]"
TICK_MS="[[ $world.tick_ms ]]"

API_URL="http://127.0.0.1:3002"
SERVER_URL="https://[[ $world.domain ]]"

DATABASE_URL="postgresql://{{ .POSTGRES_USER }}:{{ .POSTGRES_PASSWORD }}@127.0.0.1:5432/{{ .POSTGRES_DB }}"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD="{{ .REDIS_PASSWORD }}"

JWT_SECRET="{{ .API_JWT_SECRET }}"
CHAT_JWT_SECRET="{{ .CHAT_JWT_SECRET }}"
HISCORES_UPDATE_SECRET="{{ .HISCORES_UPDATE_SECRET }}"

PACKET_TRACE_PATH="/data/game-logs/world-[[ $world_id ]]/packets"
LOG_FILE_PATH="/data/game-logs/world-[[ $world_id ]]/game.log"
ANTI_CHEAT_REALTIME_ENABLED="false"
PACKET_LOG_INVALID_ENABLED="false"

WORLD_ENTITIES_FILE=worldentities.26.carbon
WORLD_ENTITY_DEFS_FILE=worldentitydefs.13.carbon
WORLD_ENTITY_ACTIONS_FILE=worldentityactions.5.carbon
NPC_ENTITY_DEFS_FILE=npcentitydefs.22.carbon
NPC_ENTITIES_FILE=npcentities.17.carbon
ITEM_DEFS_FILE=itemdefs.33.carbon
GROUND_ITEMS_FILE=grounditems.12.carbon
NPC_CONVERSATION_DEFS_FILE=npcconversationdefs.2.carbon
SHOP_DEFS_FILE=shopdefs.11.carbon
NPC_LOOT_FILE=npcloot.18.carbon

DISABLE_STAMINA=true

GLOBAL_CHAT_DISCORD_WEBHOOK_ENABLED=false
GLOBAL_CHAT_DISCORD_WEBHOOK_URL="[[ $world.global_chat_webhook ]]"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }
  [[- end ]]
}