#!/usr/bin/env bash

set -Eeuo pipefail

APP_DIR="${APP_DIR:-$HOME/AL_Profile}"
REPO_URL="${REPO_URL:-https://github.com/Adriano-Lengruber/AL_Profile.git}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.blog.yml}"
PUBLIC_DOMAIN="${PUBLIC_DOMAIN:-https://adriano-lengruber.com}"
PROJECT_NETWORK="${PROJECT_NETWORK:-al_profile_al-profile-network}"
PROXY_CONTAINER="${PROXY_CONTAINER:-nginx-proxy-app-1}"

if [ -d "$APP_DIR/.git" ]; then
  cd "$APP_DIR"
else
  mkdir -p "$APP_DIR"
  cd "$APP_DIR"
  git clone "$REPO_URL" .
fi

PREVIOUS_COMMIT="$(git rev-parse HEAD 2>/dev/null || true)"

if docker compose version >/dev/null 2>&1; then
  COMPOSE=(docker compose)
else
  COMPOSE=(docker-compose)
fi

cleanup_compose_orphans() {
  docker ps -a --format '{{.Names}}' \
    | grep -E '^[[:alnum:]]+_al-profile-(frontend|backend|mongodb)$' \
    | xargs -r docker rm -f >/dev/null 2>&1 || true
}

reconnect_proxy_network() {
  docker network connect "$PROJECT_NETWORK" "$PROXY_CONTAINER" >/dev/null 2>&1 || true
}

run_healthcheck() {
  local name="$1"
  local url="$2"
  local max_attempts="${3:-6}"

  for attempt in $(seq 1 "$max_attempts"); do
    if curl -fsS "$url" >/dev/null; then
      echo "[$name] OK - tentativa $attempt"
      return 0
    fi

    echo "[$name] aguardando - tentativa $attempt"
    sleep 5
  done

  echo "[$name] falhou"
  return 1
}

wait_for_container_health() {
  local container_name="$1"

  for attempt in 1 2 3 4 5 6 7 8; do
    local status
    status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_name" 2>/dev/null || echo missing)"

    if [ "$status" = "healthy" ] || [ "$status" = "running" ]; then
      echo "[$container_name] pronto - tentativa $attempt"
      return 0
    fi

    echo "[$container_name] status atual: $status"
    sleep 5
  done

  return 1
}

deploy_stack() {
  cleanup_compose_orphans

  "${COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build mongodb backend
  wait_for_container_health "al-profile-backend"

  "${COMPOSE[@]}" -f "$COMPOSE_FILE" up -d --build --no-deps frontend
  wait_for_container_health "al-profile-frontend"

  reconnect_proxy_network
}

rollback() {
  trap - ERR

  if [ -z "${PREVIOUS_COMMIT:-}" ]; then
    return 0
  fi

  echo "--- ROLLBACK AUTOMATICO ---"
  git reset --hard "$PREVIOUS_COMMIT"

  deploy_stack || true
}

trap 'rollback' ERR

git fetch origin master
git reset --hard origin/master

if [ ! -f "$COMPOSE_FILE" ]; then
  echo "$COMPOSE_FILE nao encontrado"
  exit 1
fi

deploy_stack

echo "--- CONTAINERS ATIVOS ---"
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}' | grep al-profile

run_healthcheck "frontend-local" "http://localhost:3003/"
run_healthcheck "proxy-local" "http://localhost:3003/api/health"
run_healthcheck "api-local" "http://localhost:3005/api/health"
run_healthcheck "api-publica" "$PUBLIC_DOMAIN/api/posts" 12
run_healthcheck "dominio-publico" "$PUBLIC_DOMAIN/" 12
