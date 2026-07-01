#!/usr/bin/env bash
# deploy.sh — Build images, push to ACR, run migrations, and apply manifests.
#
# Usage:
#   ./infra/scripts/deploy.sh <tag> [acr-login-server]
#
#   tag              Image tag to build and deploy (e.g. v1.0.0 or git SHA)
#   acr-login-server ACR hostname (default: reads from azure terraform output)
#
# Prerequisites:
#   - az CLI authenticated and correct subscription active
#   - kubectl context set to the AKS cluster
#   - Both terraform directories already applied
#
# M1/Apple Silicon note:
#   Images are always built for linux/amd64 (AKS node architecture) via docker buildx.
#   `--push` sends the image directly to ACR without loading it into the local daemon,
#   which is required for cross-platform builds on ARM hosts.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
INFRA_DIR="$REPO_ROOT/infra"

TAG="${1:-latest}"
ACR_SERVER="${2:-}"

# ── Ensure buildx builder with AMD64 support exists ───────────────────────────
# Docker Desktop on Mac includes QEMU emulation, so this works out of the box.
# If you hit "no builder" errors, run: docker buildx create --use --bootstrap
if ! docker buildx inspect amd64-builder &>/dev/null; then
  echo "→ Creating docker buildx builder (amd64-builder)..."
  docker buildx create --name amd64-builder --driver docker-container --bootstrap --use
else
  docker buildx use amd64-builder
fi

# ── Resolve ACR login server ───────────────────────────────────────────────────
if [[ -z "$ACR_SERVER" ]]; then
  echo "→ Reading ACR login server from terraform output..."
  ACR_SERVER=$(terraform -chdir="$INFRA_DIR/terraform/azure" output -raw acr_login_server)
fi

BACKEND_IMAGE="$ACR_SERVER/backend:$TAG"
FRONTEND_IMAGE="$ACR_SERVER/frontend:$TAG"

echo "→ ACR:      $ACR_SERVER"
echo "→ Backend:  $BACKEND_IMAGE"
echo "→ Frontend: $FRONTEND_IMAGE"
echo ""

# ── Authenticate to ACR ────────────────────────────────────────────────────────
echo "→ Authenticating Docker to ACR..."
ACR_NAME="${ACR_SERVER%%.*}"
az acr login --name "$ACR_NAME"

# ── Build and push images ─────────────────────────────────────────────────────
# --platform linux/amd64  targets AKS node architecture (works on M1 via QEMU)
# --push                  sends directly to registry (no local image load needed for cross-platform)
echo "→ Building and pushing backend image (linux/amd64)..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  --tag "$BACKEND_IMAGE" \
  "$REPO_ROOT/backend"

echo "→ Building and pushing frontend image (linux/amd64)..."
docker buildx build \
  --platform linux/amd64 \
  --push \
  --tag "$FRONTEND_IMAGE" \
  "$REPO_ROOT/frontend"

# ── Run database migrations ────────────────────────────────────────────────────
echo "→ Running database migrations..."

# Delete any previous migration job so we can re-run (Jobs are immutable once complete)
kubectl delete job db-migrate -n job-hunter --ignore-not-found

# Substitute the image tag and apply the migration job
BACKEND_IMAGE="$BACKEND_IMAGE" FRONTEND_IMAGE="$FRONTEND_IMAGE" \
  envsubst < "$INFRA_DIR/manifests/02-migration-job.yaml" | kubectl apply -f -

echo "→ Waiting for migration job to complete (timeout: 5m)..."
kubectl wait job/db-migrate \
  --namespace job-hunter \
  --for=condition=complete \
  --timeout=300s

echo "→ Migration job completed."

# ── Deploy application manifests ───────────────────────────────────────────────
echo "→ Deploying backend and frontend..."
BACKEND_IMAGE="$BACKEND_IMAGE" FRONTEND_IMAGE="$FRONTEND_IMAGE" \
  envsubst < "$INFRA_DIR/manifests/03-backend.yaml" | kubectl apply -f -

BACKEND_IMAGE="$BACKEND_IMAGE" FRONTEND_IMAGE="$FRONTEND_IMAGE" \
  envsubst < "$INFRA_DIR/manifests/04-frontend.yaml" | kubectl apply -f -

kubectl apply -f "$INFRA_DIR/manifests/05-ingress.yaml"

# ── Rollout status ────────────────────────────────────────────────────────────
echo "→ Waiting for rollouts..."
kubectl rollout status deployment/backend  -n job-hunter --timeout=120s
kubectl rollout status deployment/frontend -n job-hunter --timeout=120s

echo ""
echo "✓ Deployment complete."
echo ""
echo "  App:         https://jobs.k8s.cuth.dev"
echo "  Cert status: kubectl get certificate -n job-hunter"
echo "  Pods:        kubectl get pods -n job-hunter"
