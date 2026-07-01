resource "kubernetes_namespace" "job_hunter" {
  metadata {
    name = "job-hunter"
    labels = {
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }
}

locals {
  # asyncpg requires ssl=true rather than sslmode=require in the query string
  database_url = "postgresql+asyncpg://${var.postgres_admin_username}:${var.postgres_admin_password}@${var.postgres_fqdn}:5432/${var.postgres_db_name}?ssl=true"
}

resource "kubernetes_secret" "app" {
  metadata {
    name      = "job-hunter-secrets"
    namespace = kubernetes_namespace.job_hunter.metadata[0].name
  }

  data = {
    DATABASE_URL = local.database_url
    SECRET_KEY   = var.app_secret_key
  }
}
