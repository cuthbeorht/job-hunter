#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { printf "${GREEN}==> %s${NC}\n" "$*"; }
warn()  { printf "${YELLOW}[warn] %s${NC}\n" "$*"; }
error() { printf "${RED}[error] %s${NC}\n" "$*" >&2; exit 1; }

command -v docker >/dev/null 2>&1      || error "docker is not installed"
docker compose version >/dev/null 2>&1 || error "docker compose (v2) is not installed"

usage() {
  cat <<EOF
Usage: $(basename "$0") [--down | --reset | --help]

  (no flag)  Prepare .env, build images, run migrations, start all services
  --down     Stop and remove containers and networks (data volume is preserved)
  --reset    Stop and remove containers, networks, and volumes (WIPES THE DATABASE)
  --help     Show this message
EOF
}

generate_secret() {
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex 32
  else
    python3 -c "import secrets; print(secrets.token_hex(32))"
  fi
}

prepare_env() {
  if [[ -f "$ENV_FILE" ]]; then
    warn ".env already exists."
    read -rp "Overwrite? [y/N] " choice
    [[ "$(echo "$choice" | tr '[:upper:]' '[:lower:]')" == "y" ]] || { info "Keeping existing .env."; return; }
  fi

  info "Configuring environment..."

  read -rp  "  POSTGRES_USER     (default: postgres):   " pg_user
  pg_user="${pg_user:-postgres}"

  read -rsp "  POSTGRES_PASSWORD (default: postgres):   " pg_pass
  echo
  pg_pass="${pg_pass:-postgres}"

  read -rp  "  POSTGRES_DB       (default: job_hunter): " pg_db
  pg_db="${pg_db:-job_hunter}"

  local secret_key
  secret_key=$(generate_secret)

  cat > "$ENV_FILE" <<EOF
# PostgreSQL
POSTGRES_USER=${pg_user}
POSTGRES_PASSWORD=${pg_pass}
POSTGRES_DB=${pg_db}

# Backend
DATABASE_URL=postgresql+asyncpg://${pg_user}:${pg_pass}@db:5432/${pg_db}
SECRET_KEY=${secret_key}
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=["http://localhost:3000"]
EOF

  info ".env written."
}

do_start() {
  prepare_env

  cd "$SCRIPT_DIR"

  info "Building Docker images..."
  docker compose build

  info "Starting database..."
  docker compose up -d db

  info "Running migrations (output below)..."
  echo ""
  docker compose up --no-build migrate
  echo ""

  info "Starting backend and frontend..."
  docker compose up -d --no-build backend frontend

  echo ""
  docker compose ps
  echo ""
  info "App:              http://localhost:3000"
  info "Tail logs:        docker compose logs -f"
  info "Stop:             ./$(basename "$0") --down"
  info "Wipe & restart:   ./$(basename "$0") --reset && ./$(basename "$0")"
}

do_down() {
  cd "$SCRIPT_DIR"
  info "Stopping containers and removing networks..."
  docker compose down
  info "Done. Data volume is preserved. Run ./$(basename "$0") to start again."
}

do_reset() {
  warn "This will destroy ALL data including the Postgres volume."
  read -rp "Are you sure? [y/N] " confirm
  [[ "$(echo "$confirm" | tr '[:upper:]' '[:lower:]')" == "y" ]] || { info "Aborted."; exit 0; }
  cd "$SCRIPT_DIR"
  info "Tearing down containers, networks, and volumes..."
  docker compose down -v
  info "Done. Run ./$(basename "$0") to rebuild and start fresh."
}

case "${1:-}" in
  "")         do_start ;;
  --down)     do_down ;;
  --reset)    do_reset ;;
  --help|-h)  usage; exit 0 ;;
  *)          usage >&2; exit 1 ;;
esac
