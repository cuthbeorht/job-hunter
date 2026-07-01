output "resource_group_name" {
  description = "Name of the Azure resource group"
  value       = azurerm_resource_group.main.name
}

output "aks_cluster_name" {
  description = "AKS cluster name"
  value       = azurerm_kubernetes_cluster.main.name
}

output "aks_get_credentials_command" {
  description = "Run this command to configure kubectl after apply"
  value       = "az aks get-credentials --resource-group ${azurerm_resource_group.main.name} --name ${azurerm_kubernetes_cluster.main.name} --overwrite-existing"
}

output "acr_login_server" {
  description = "ACR login server hostname (use this as image prefix)"
  value       = azurerm_container_registry.main.login_server
}

output "acr_push_command" {
  description = "Authenticate Docker to push images to ACR"
  value       = "az acr login --name ${azurerm_container_registry.main.name}"
}

output "postgres_fqdn" {
  description = "PostgreSQL Flexible Server fully-qualified domain name"
  value       = azurerm_postgresql_flexible_server.main.fqdn
}

output "postgres_admin_username" {
  description = "PostgreSQL administrator username"
  value       = var.postgres_admin_username
}

output "postgres_db_name" {
  description = "Application database name"
  value       = azurerm_postgresql_flexible_server_database.main.name
}
