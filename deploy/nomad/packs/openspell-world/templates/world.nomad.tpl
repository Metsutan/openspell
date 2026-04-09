job "openspell-world-[[ (var "openspell_world" .).world_id ]]" {
  datacenters = ["dc1"]
  type        = "service"

  group "game-server" {
    network {
      mode = "bridge"
      port "game" {
        static = [[ (var "openspell_world" .).port ]]
      }
    }

    volume "game_logs" {
      type      = "host"
      source    = "game_logs"
      read_only = false
    }

    service {
      name     = "openspell-game-[[ (var "openspell_world" .).world_id ]]"
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
        args    = ["-p", "/opt/openspell/data/logs/world-[[ (var "openspell_world" .).world_id ]]"]
      }
    }

    task "game" {
      driver = "podman"
      config {
        image = "[[ (var "openspell_world" .).game_image ]]"
        ports = ["game"]
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
SERVER_ID="[[ (var "openspell_world" .).world_id ]]"
PERSISTENCE_ID="[[ (var "openspell_world" .).persistence_id ]]"
MAX_CONNECTIONS="[[ (var "openspell_world" .).max_connections ]]"

API_URL="http://127.0.0.1:3002"
SERVER_URL="http://localhost:[[ (var "openspell_world" .).port ]]"

DATABASE_URL="postgresql://{{ .POSTGRES_USER }}:{{ .POSTGRES_PASSWORD }}@127.0.0.1:5432/{{ .POSTGRES_DB }}"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD="{{ .REDIS_PASSWORD }}"

JWT_SECRET="{{ .API_JWT_SECRET }}"
CHAT_JWT_SECRET="{{ .CHAT_JWT_SECRET }}"
HISCORES_UPDATE_SECRET="{{ .HISCORES_UPDATE_SECRET }}"

PACKET_TRACE_PATH="/data/game-logs/world-[[ (var "openspell_world" .).world_id ]]/packets"
LOG_FILE_PATH="/data/game-logs/world-[[ (var "openspell_world" .).world_id ]]/game.log"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }
}