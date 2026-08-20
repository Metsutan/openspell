namespace "default" {
  variables {
    path "nomad/jobs/openspell-backup" {
      capabilities = ["read", "list"]
    }
  }
}
