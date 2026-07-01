output "ingress_ip" {
  description = "Public IP address of the NGINX ingress controller LoadBalancer"
  value       = data.kubernetes_service.ingress_nginx.status[0].load_balancer[0].ingress[0].ip
}

output "app_url" {
  description = "Application URL (TLS cert may take a few minutes to issue)"
  value       = "https://${var.domain_name}"
}

output "next_steps" {
  description = "Commands to run after terraform apply"
  value       = <<-EOT
    1. Apply ClusterIssuer:
       kubectl apply -f ../../manifests/01-clusterissuer.yaml

    2. Build and push images, then run migration job:
       ../../scripts/deploy.sh <backend-image-tag> <frontend-image-tag>

    3. Check certificate status:
       kubectl get certificate -n job-hunter
  EOT
}
