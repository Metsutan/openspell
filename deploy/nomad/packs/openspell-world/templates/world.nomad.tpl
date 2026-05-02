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

LOG_FILE_PATH="/data/game-logs/world-[[ $world_id ]]/game.log"

ANTI_CHEAT_REALTIME_ENABLED=true
ANTI_CHEAT_ACTION_MIN_INTERVAL_MS=50
ANTI_CHEAT_MAX_ACTIONS_PER_TICK=6
ANTI_CHEAT_INVALID_WINDOW_MS=60000
ANTI_CHEAT_INVALID_MAX=3
ANTI_CHEAT_DROP_WINDOW_MS=10000
ANTI_CHEAT_DROP_AMOUNT_THRESHOLD=1000
ANTI_CHEAT_TRADE_WINDOW_MS=120000
ANTI_CHEAT_TRADE_MAX=6
ANTI_CHEAT_MULING_AMOUNT_THRESHOLD=2500
ANTI_CHEAT_ALERT_COOLDOWN_MS=600000
ANTI_CHEAT_REALTIME_CLEANUP_MS=120000
ANTI_CHEAT_OVERRIDE_REFRESH_MS=60000
ANTI_CHEAT_ANALYZER_ENABLED=false
ANTI_CHEAT_ANALYZER_INTERVAL_MS=300000
ANTI_CHEAT_ANALYZER_DEDUPE_WINDOW_MS=86400000
ANTI_CHEAT_PACKET_SPIKE_THRESHOLD=50
ANTI_CHEAT_PACKET_SPIKE_CRITICAL_THRESHOLD=200
ANTI_CHEAT_PACKET_UNIQUE_REASONS_THRESHOLD=5
ANTI_CHEAT_DROP_WINDOW_MINUTES=60
ANTI_CHEAT_DROP_MIN_COUNT=20
ANTI_CHEAT_DROP_NEVER_PICKUP_RATIO=0.8
ANTI_CHEAT_TRADE_WINDOW_MINUTES=10
ANTI_CHEAT_TRADE_MIN_COUNT=5
ANTI_CHEAT_WEALTH_WINDOW_MINUTES=30
ANTI_CHEAT_WEALTH_AMOUNT_THRESHOLD=1000000
ANTI_CHEAT_SHOP_WINDOW_MINUTES=60
ANTI_CHEAT_SHOP_MIN_COUNT=10
ANTI_CHEAT_SHOP_GOLD_THRESHOLD=100000
ANTI_CHEAT_IP_SHARED_WINDOW_MINUTES=1440
ANTI_CHEAT_IP_SHARED_MIN_USERS=3

PACKET_LOG_INVALID_ENABLED=true
PACKET_LOG_INVALID_BATCH_SIZE=200
PACKET_LOG_INVALID_FLUSH_MS=2000
PACKET_LOG_INVALID_DEDUP_WINDOW_MS=60000
PACKET_LOG_INVALID_SAMPLE_RATE=1.0

PACKET_TRACE_ENABLED=true
PACKET_TRACE_PATH="/data/game-logs/world-[[ $world_id ]]/packets"
PACKET_TRACE_ROTATE_MB=50
PACKET_TRACE_ROTATE_MINUTES=30
PACKET_TRACE_FLUSH_MS=1000
PACKET_TRACE_RETENTION_DAYS=30
PACKET_TRACE_SAMPLE_RATE=1.0

DISABLE_STAMINA=true

GLOBAL_CHAT_DISCORD_WEBHOOK_ENABLED="[[ $world.global_chat_webhook_enabled ]]"
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