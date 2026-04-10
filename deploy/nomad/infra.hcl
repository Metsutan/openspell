job "openspell-infra" {
  datacenters = ["dc1"]
  type        = "service"

  # ==========================================
  # POSTGRESQL GROUP
  # ==========================================
  group "database" {
    network {
      mode = "bridge"
      port "postgres" {
        static = 5432
      }
    }

    # Make sure 'pg_data' is defined in your Nomad client's host_volume config
    volume "pg_data" {
      type      = "host"
      source    = "pg_data"
      read_only = false
    }
    
    service {
      name     = "openspell-postgres"
      port     = "postgres"
      provider = "consul"
        
      connect {
        sidecar_service {}
      }
        
      check {
        name     = "postgres-check"
        type     = "script"
        command  = "/usr/bin/pg_isready"
        args     = ["-U", "openspell"]
        interval = "10s"
        timeout  = "2s"
        task     = "postgres"
      }
    }

    task "postgres" {
      driver = "podman"

      volume_mount {
        volume      = "pg_data"
        destination = "/var/lib/postgresql/data"
      }

      config {
        image = "docker.io/library/postgres:16"
        ports = ["postgres"]

        volumes = [
          "/opt/openspell/data/init-db:/docker-entrypoint-initdb.d:ro"
        ]
      }

      # Pulling from the unified Job-Level path
      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-infra" -}}
POSTGRES_USER="{{ .POSTGRES_USER }}"
POSTGRES_PASSWORD="{{ .POSTGRES_PASSWORD }}"
POSTGRES_DB="{{ .POSTGRES_DB }}"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }

  # ==========================================
  # REDIS GROUP
  # ==========================================
  group "cache" {
    network {
      mode = "bridge"
      port "redis" {
        static = 6379
      }
    }

    # Make sure 'redis_data' is defined in your Nomad client's host_volume config
    volume "redis_data" {
      type      = "host"
      source    = "redis_data"
      read_only = false
    }

    service {
      name     = "openspell-redis"
      port     = "redis"
      provider = "consul"
      
      connect {
        sidecar_service {}
      }

      check {
        name     = "redis-check"
        type     = "script"
        command  = "/usr/local/bin/redis-cli"
        args     = ["ping"]
        interval = "10s"
        timeout  = "3s"
        task     = "redis"
      }
    }

    task "redis" {
      driver = "podman"

      volume_mount {
        volume      = "redis_data"
        destination = "/data"
      }

      config {
        image = "docker.io/library/redis:7-alpine"
        ports = ["redis"]
        # Nomad interpolates the REDIS_PASSWORD env var directly into the podman command
        args  = ["redis-server", "--appendonly", "yes", "--requirepass", "${REDIS_PASSWORD}"]
      }

      # Pulling from the exact same unified path
      template {
        data = <<EOH
{{- with nomadVar "nomad/jobs/openspell-infra" -}}
REDIS_PASSWORD="{{ .REDIS_PASSWORD }}"
{{- end -}}
EOH
        destination = "local/env"
        env         = true
      }
    }
  }
}