# Cloudflare proxy is OFF (grey cloud) so that cert-manager's HTTP-01 ACME challenge
# reaches the ingress controller directly. Turn it on only if you switch to DNS-01 challenges.
resource "cloudflare_record" "app" {
  zone_id = var.cloudflare_zone_id
  name    = var.dns_record_name
  content = data.kubernetes_service.ingress_nginx.status[0].load_balancer[0].ingress[0].ip
  type    = "A"
  ttl     = 60
  proxied = false
}
