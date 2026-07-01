variable "kubeconfig_path" {
  description = "Path to the kubeconfig file (populated by `az aks get-credentials`)"
  type        = string
  default     = "~/.kube/config"
}

variable "kubeconfig_context" {
  description = "kubectl context name for the AKS cluster (matches the cluster name by default)"
  type        = string
}

# ── Cloudflare ────────────────────────────────────────────────────────────────

variable "cloudflare_api_token" {
  description = "Cloudflare API token with Zone:DNS:Edit permission for cuth.dev"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for cuth.dev (find it in the zone overview page)"
  type        = string
}

variable "domain_name" {
  description = "Fully-qualified domain name the app will be served at"
  type        = string
  default     = "jobs.k8s.cuth.dev"
}

variable "dns_record_name" {
  description = "DNS record name relative to the zone root (e.g. 'jobs.k8s' for jobs.k8s.cuth.dev)"
  type        = string
  default     = "jobs.k8s"
}

# ── Let's Encrypt ─────────────────────────────────────────────────────────────

variable "acme_email" {
  description = "Email address for Let's Encrypt certificate expiry notifications"
  type        = string
  default     = "david.sciacchettano+claude@gmail.com"
}

# ── Database ──────────────────────────────────────────────────────────────────

variable "postgres_fqdn" {
  description = "PostgreSQL Flexible Server FQDN (from azure terraform output postgres_fqdn)"
  type        = string
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "pgadmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

variable "postgres_db_name" {
  description = "Application database name"
  type        = string
  default     = "job_hunter"
}

# ── Application ───────────────────────────────────────────────────────────────

variable "app_secret_key" {
  description = "JWT secret key for the FastAPI backend (generate with: openssl rand -hex 32)"
  type        = string
  sensitive   = true
}

variable "backend_image" {
  description = "Full image reference for the backend (e.g. jobhunteracr.azurecr.io/backend:latest)"
  type        = string
}

variable "frontend_image" {
  description = "Full image reference for the frontend (e.g. jobhunteracr.azurecr.io/frontend:latest)"
  type        = string
}

variable "backend_replicas" {
  description = "Number of backend pod replicas"
  type        = number
  default     = 2
}

variable "frontend_replicas" {
  description = "Number of frontend pod replicas"
  type        = number
  default     = 2
}
