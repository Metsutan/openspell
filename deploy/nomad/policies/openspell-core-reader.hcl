namespace "default" {
  variables {
    path "nomad/jobs/openspell-core" {
      capabilities = ["read", "list"]
    }
  }
}