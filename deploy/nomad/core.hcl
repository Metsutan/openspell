variable "api_image" {
    type    = string
    description = "Container image path for the API"
}

variable "web_image" {
    type    = string
    description = "Container image path for the Web frontend"
}

variable "chat_image" {
    type    = string
    description = "Container image path for the Chat service"
}

job "openspell-core" {
  datacenters = ["dc1"]
  type        = "service"

  # ==========================================
  # API GROUP
  # ==========================================
  group "api" {
    network {
      mode = "bridge"
      port "api" {
        static = 3002
      }
    }
    
    service {
      name     = "openspell-api"
      port     = "api"
      provider = "consul"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "openspell-postgres"
              local_bind_port = 5432
            }
            upstreams {
              destination_name = "openspell-redis"
              local_bind_port = 6379
            }
          }
        }
      }

      check {
        type     = "http"
        path = "/health"
        interval = "10s"
        timeout  = "2s"
        task     = "api"
      }
    }

    task "api" {
      driver = "podman"

      config {
        # UPDATE THIS: Point to your pre-built image
        image = var.api_image
        // ports = ["api"]
        
        # Security Hardening: Drop all Linux capabilities
        cap_drop = ["ALL"]
      }

      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-core" -}}
NODE_ENV="production"
# Point to the LOCAL ports managed by the sidecar proxy
DATABASE_URL="postgresql://{{ .POSTGRES_USER }}:{{ .POSTGRES_PASSWORD }}@127.0.0.1:5432/{{ .POSTGRES_DB }}"
REDIS_HOST="127.0.0.1"
REDIS_PORT="6379"
REDIS_PASSWORD="{{ .REDIS_PASSWORD }}"

API_JWT_SECRET="{{ .API_JWT_SECRET }}"
API_WEB_SECRET="{{ .API_WEB_SECRET }}"
GAME_SERVER_SECRET="{{ .GAME_SERVER_SECRET }}"
WORLD_REGISTRATION_SECRET="{{ .WORLD_REGISTRATION_SECRET }}"
HISCORES_UPDATE_SECRET="{{ .HISCORES_UPDATE_SECRET }}"
API_URL="http://127.0.0.1:3002"
WEB_URL="{{ .WEB_URL }}"
USING_REVERSE_PROXY="{{ .USING_REVERSE_PROXY }}"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }

  # ==========================================
  # WEB GROUP
  # ==========================================
  group "web" {
    network {
      mode = "bridge"
      port "web" {
        static = 8887
      }
    }

    service {
      name     = "openspell-web"
      port     = "web"
      provider = "consul"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "openspell-api"
              local_bind_port = 3002
            }
          }
        }
      }

      check {
        type     = "http"
        path = "/"
        interval = "10s"
        timeout  = "2s"
        task = "web"
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
        args    = ["-c", "until curl -s http://127.0.0.1:3002/health > /dev/null; do echo 'Waiting for API proxy...'; sleep 2; done"]
      }
    }

    task "web" {
      driver = "podman"

      config {
        # UPDATE THIS: Point to your pre-built image
        image = var.web_image
        ports = ["web"]
        cap_drop = ["ALL"]
      }

      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-core" -}}
NODE_ENV="production"
SESSION_SECRET="{{ .WEB_SESSION_SECRET }}"
API_WEB_SECRET="{{ .API_WEB_SECRET }}"
WEB_URL="{{ .WEB_URL }}"
CHAT_URL="{{ .CHAT_URL }}"
CLIENT_API_URL="{{ .CLIENT_API_URL }}"
USING_REVERSE_PROXY="{{ .USING_REVERSE_PROXY }}"
CDN_URL="{{ .CDN_URL }}"

# Web app connects to API via local mesh upstream
API_URL="http://127.0.0.1:3002"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
        change_mode = "restart"
      }
    }
  }

  # ==========================================
  # CHAT GROUP
  # ==========================================
  group "chat" {
    network {
      mode = "bridge"
      port "chat" {
        static = 8765
      }
    }

    service {
      name     = "openspell-chat"
      port     = "chat"
      provider = "consul"

      connect {
        sidecar_service {
          proxy {
            upstreams {
              destination_name = "openspell-postgres"
              local_bind_port = 5432
            }
          }
        }
      }

      check {
        type     = "http"
        path = "/health"
        interval = "10s"
        timeout  = "2s"
        task = "chat"
      }
    }

    task "chat" {
      driver = "podman"

      config {
        # UPDATE THIS: Point to your pre-built image
        image = var.chat_image
        ports = ["chat"]
        cap_drop = ["ALL"]
      }

      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-core" -}}
NODE_ENV="production"
CHAT_JWT_SECRET="{{ .CHAT_JWT_SECRET }}"
DATABASE_URL="postgresql://{{ .POSTGRES_USER }}:{{ .POSTGRES_PASSWORD }}@127.0.0.1:5432/{{ .POSTGRES_DB }}"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }
}