namespace "default" {
  variables {
    path "nomad/jobs/shared/registry" {
      capabilities = ["read"]
    }
  }
}