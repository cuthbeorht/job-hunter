variable "subscription_id" {
  description = "Azure subscription ID"
  type        = string
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Name of the Azure resource group"
  type        = string
  default     = "job-hunter-rg"
}

variable "project_name" {
  description = "Short name used for resource naming (no hyphens, max 12 chars — ACR names must be globally unique alphanumeric)"
  type        = string
  default     = "jobhunter"
}

variable "node_count" {
  description = "Number of AKS system node pool nodes"
  type        = number
  default     = 2
}

variable "node_vm_size" {
  description = "VM size for AKS nodes"
  type        = string
  default     = "Standard_B2s"
}

variable "kubernetes_version" {
  description = "Kubernetes version for the AKS cluster"
  type        = string
  default     = "1.30"
}

variable "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "pgadmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password (min 8 chars, must include uppercase, lowercase, number, and special character)"
  type        = string
  sensitive   = true
}

variable "postgres_version" {
  description = "PostgreSQL major version"
  type        = string
  default     = "16"
}

variable "postgres_storage_mb" {
  description = "PostgreSQL storage in MB"
  type        = number
  default     = 32768 # 32 GB
}

variable "postgres_sku" {
  description = "PostgreSQL Flexible Server SKU (B_Standard_B1ms is the cheapest burstable tier)"
  type        = string
  default     = "B_Standard_B1ms"
}
