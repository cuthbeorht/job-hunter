# Infrastructure — Azure Kubernetes Service

Deploys the job-hunter app to AKS with:
- **Azure Container Registry** for images
- **Azure Database for PostgreSQL Flexible Server** (v16)
- **NGINX Ingress Controller** with Azure LoadBalancer
- **cert-manager** + Let's Encrypt for TLS
- **Cloudflare** A record pointing `jobs.k8s.cuth.dev` at the ingress IP

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Terraform | ≥ 1.9 | `brew install terraform` |
| Azure CLI | latest | `brew install azure-cli` |
| kubectl | latest | `brew install kubectl` |
| Docker | latest | [docker.com](https://docker.com) |
| envsubst | (macOS built-in) | `brew install gettext` if missing |

Authenticate to Azure before running anything:

```bash
az login
az account set --subscription "<your-subscription-id>"
```

---

## Step 1 — Provision Azure infrastructure

```bash
cd infra/terraform/azure

cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set subscription_id and postgres_admin_password
vim terraform.tfvars

terraform init
terraform plan
terraform apply
```

Note the outputs — you'll need them in Step 3:

```bash
terraform output aks_get_credentials_command   # configure kubectl
terraform output acr_login_server              # image prefix
terraform output postgres_fqdn                 # DB hostname
```

---

## Step 2 — Configure kubectl

Run the command from the previous step's output:

```bash
az aks get-credentials \
  --resource-group job-hunter-rg \
  --name jobhunter-aks \
  --overwrite-existing

kubectl get nodes   # verify cluster is reachable
```

---

## Step 3 — Provision Kubernetes resources and Cloudflare DNS

```bash
cd infra/terraform/k8s

cp terraform.tfvars.example terraform.tfvars
# Fill in:
#   kubeconfig_context      (matches the AKS cluster name: jobhunter-aks)
#   cloudflare_api_token    (Zone:DNS:Edit permission on cuth.dev)
#   cloudflare_zone_id      (from Cloudflare dashboard → cuth.dev → Overview)
#   postgres_fqdn           (from Step 1 output)
#   postgres_admin_password (same as Step 1)
#   app_secret_key          (generate: openssl rand -hex 32)
#   backend_image / frontend_image (set after Step 4)
vim terraform.tfvars

terraform init
terraform apply
```

This installs ingress-nginx and cert-manager via Helm, creates the `job-hunter` namespace and K8s secrets, and points the Cloudflare A record at the ingress LoadBalancer IP.

---

## Step 4 — Apply ClusterIssuer

Wait ~60 seconds after Step 3 for cert-manager CRDs to be ready, then:

```bash
kubectl apply -f infra/manifests/01-clusterissuer.yaml
```

---

## Step 5 — Build, push, and deploy

The `deploy.sh` script handles image builds, push, migration job, and manifest apply in one shot:

```bash
# Use a git SHA or semver tag
GIT_SHA=$(git rev-parse --short HEAD)

./infra/scripts/deploy.sh "$GIT_SHA"
```

Or with explicit ACR server:

```bash
./infra/scripts/deploy.sh v1.0.0 jobhunteracr.azurecr.io
```

### What the script does

1. Builds `backend` and `frontend` Docker images
2. Pushes them to ACR
3. Runs the Alembic migration Job (`alembic upgrade head`) and waits for it to complete
4. Applies backend and frontend Deployments + Services
5. Applies the Ingress rule
6. Waits for both rollouts to finish

---

## Step 6 — Verify TLS

The Let's Encrypt certificate is issued asynchronously. Check its status:

```bash
kubectl get certificate -n job-hunter
kubectl describe certificate job-hunter-tls -n job-hunter
```

The `READY` column should become `True` within ~2 minutes once DNS has propagated.

---

## Manifest reference

| File | Purpose |
|------|---------|
| `01-clusterissuer.yaml` | Let's Encrypt ClusterIssuer (HTTP-01 challenge via ingress-nginx) |
| `02-migration-job.yaml` | Alembic `upgrade head` — run before each deployment |
| `03-backend.yaml` | FastAPI Deployment + ClusterIP Service (port 8000) |
| `04-frontend.yaml` | React/nginx Deployment + ClusterIP Service (port 80) |
| `05-ingress.yaml` | TLS Ingress: `/api/*` → backend, `/*` → frontend |

### Ingress path routing

```
https://jobs.k8s.cuth.dev/api/endpoint  →  backend:8000/endpoint  (prefix stripped)
https://jobs.k8s.cuth.dev/              →  frontend:80/
```

---

## Day-2 operations

### Re-deploy with a new image tag

```bash
./infra/scripts/deploy.sh <new-tag>
```

### Scale nodes

```bash
# In infra/terraform/azure/terraform.tfvars
node_count = 3
terraform -chdir=infra/terraform/azure apply
```

### View logs

```bash
kubectl logs -n job-hunter -l app=backend  --tail=100 -f
kubectl logs -n job-hunter -l app=frontend --tail=50  -f
```

### Shell into a backend pod

```bash
kubectl exec -it -n job-hunter deploy/backend -- /bin/bash
```

---

## Production upgrade checklist

- [ ] Replace the PostgreSQL `allow-azure-services` firewall rule with VNet integration + private endpoint
- [ ] Enable Cloudflare proxy (orange cloud) and switch to DNS-01 ACME challenge for E2E TLS
- [ ] Add Horizontal Pod Autoscaler for backend and frontend
- [ ] Enable cluster autoscaler on the AKS node pool
- [ ] Store `terraform.tfvars` secrets in Azure Key Vault and read them with the AzureRM data source
- [ ] Move Terraform state to Azure Blob Storage (add `backend "azurerm" {}` block)
- [ ] Set up GitHub Actions CI/CD to call `deploy.sh` on merge to main
