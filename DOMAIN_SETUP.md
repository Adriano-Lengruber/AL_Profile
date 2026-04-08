# Configuração do Domínio no Nginx Proxy Manager

## DNS (Cloudflare) ✅
O DNS já está configurado:
- Tipo: A Record
- Nome: adriano-lengruber.com
- Valor: 148.230.75.59
- Proxy: Ativo (Proxied)

## Docker Compose - Atualização ✅
O arquivo docker-compose.blog.yml foi atualizado para incluir a rede do Nginx Proxy Manager.

### Na VPS (Usuário: adriano), execute:

```bash
cd ~/AL_Profile
docker-compose -f docker-compose.blog.yml down
docker-compose -f docker-compose.blog.yml up -d --build
```

## Nginx Proxy Manager - Configuração

Acesse o painel do Nginx Proxy Manager: http://148.230.75.59:81/

### 1. Criar Proxy para o Frontend (Site)

1. Clique em **Proxy Hosts** > **Add Proxy Host**
2. Configure:
   - **Domain Names**: adriano-lengruber.com
   - **Scheme**: http
   - **Forward Hostname / IP**: al-profile-frontend
   - **Forward Port**: 80
   - **Cache Assets**: Enabled
   - **Block Common Exploits**: Enabled
3. Clique em **Save**

### 2. Criar Proxy para a API (opcional)

1. Clique em **Proxy Hosts** > **Add Proxy Host**
2. Configure:
   - **Domain Names**: api.adriano-lengruber.com
   - **Scheme**: http
   - **Forward Hostname / IP**: al-profile-backend
   - **Forward Port**: 3001
   - **Cache Assets**: Disabled
   - **Block Common Exploits**: Enabled
3. Clique em **Save**

### 3. Configurar SSL (Let's Encrypt)

1. Clique no proxy host criado
2. Vá para a aba **SSL**
3. Clique em **Add SSL Certificate**
4. Selecione **Let's Encrypt**
5. Marque **Force SSL**
6. Clique em **Save**

### 4. Rede do Docker ✅

Para o Nginx Proxy Manager alcançar os containers Docker, a rede já foi conectada.

**Status Atual dos Containers na VPS:**
- `nginx-proxy-app-1`: Gerenciador de Proxy e SSL.
- `al-profile-frontend`: Frontend (Porta 3003).
- `al-profile-backend`: Backend API (Porta 3005 -> 3001 interno).
- `al-profile-mongodb`: Banco de dados MongoDB.
- `portainer`: Gestão visual de containers.
- Outros: `devmaker3d`, `clubedocafe-frontend/server`, `adminer`.

```bash
# Comando para reconectar se necessário:
docker network connect al_profile_al-profile-network nginx-proxy-app-1
```

**Nota:** Se você recriar o container do Nginx Proxy Manager ou a rede do projeto, pode ser necessário executar este comando novamente.

---

## 🚀 GitHub Actions - CI/CD Automático ✅

O projeto agora conta com deploy automático. Toda vez que um `push` for feito na branch `master`, o GitHub Actions atualizará a VPS.

### 🔑 Configuração Necessária (GitHub Secrets)

No seu repositório do GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

1.  **`SSH_HOST`**: `148.230.75.59`
2.  **`SSH_USER`**: `adriano`
3.  **`SSH_PRIVATE_KEY`**: Sua chave privada SSH que tem acesso à VPS.

### 📝 O que o workflow faz:
1. Conecta via SSH na VPS.
2. Navega até `~/AL_Profile`.
3. Faz o `git pull origin master`.
4. Reinicia os containers com `docker-compose -f docker-compose.blog.yml up -d --build`.
5. Reconecta a rede do Nginx Proxy Manager se necessário.

### ✅ Procedimento seguro antes de atualizar a VPS

Sempre registre o estado estável antes de qualquer atualização:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile
git rev-parse --short HEAD
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -I http://localhost:3003/
curl -I https://adriano-lengruber.com/
```

Se algum desses checks já estiver falhando, não atualize nada antes de corrigir.

### 🚀 Atualização manual segura na VPS

Quando for necessário atualizar manualmente, siga esta ordem:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile

PREV_COMMIT=$(git rev-parse --short HEAD)
echo "Commit estável atual: $PREV_COMMIT"

git fetch origin master
git reset --hard origin/master

docker-compose -f docker-compose.blog.yml up -d --build
docker network connect al_profile_al-profile-network nginx-proxy-app-1 2>/dev/null || true

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
curl -I http://localhost:3003/
curl -I http://localhost:3005/api/posts
curl -I https://adriano-lengruber.com/
```

Só considere a atualização concluída se os três `curl` responderem corretamente.

### 🆘 Procedimento de emergência para 502 / Bad Gateway

Se o Cloudflare mostrar erro 502, siga esta sequência:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile

docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
docker logs --tail 80 al-profile-frontend
docker logs --tail 80 al-profile-backend
docker logs --tail 80 nginx-proxy-app-1

docker network inspect al_profile_al-profile-network
docker network connect al_profile_al-profile-network nginx-proxy-app-1 2>/dev/null || true

curl -I http://localhost:3003/
docker exec nginx-proxy-app-1 getent hosts al-profile-frontend
curl -I https://adriano-lengruber.com/
```

Checklist rápido:

1. `al-profile-frontend` precisa estar `Up`.
2. `nginx-proxy-app-1` precisa estar conectado à rede `al_profile_al-profile-network`.
3. `curl -I http://localhost:3003/` precisa retornar `200`.
4. `docker exec nginx-proxy-app-1 getent hosts al-profile-frontend` precisa resolver o host.
5. Só depois valide novamente o domínio público.

Se o `docker-compose` falhar com `No such image` ou tentar recriar containers com nomes estranhos como `<hash>_al-profile-frontend` ou `<hash>_al-profile-backend`, remova o container órfão antes de subir novamente:

```bash
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Image}}\t{{.Status}}" | grep al-profile
docker-compose -f docker-compose.blog.yml rm -sf frontend backend || true
docker rm -f <container_orfao> 2>/dev/null || true
docker-compose -f docker-compose.blog.yml up -d frontend backend
```

Esse erro acontece quando o Docker tenta recriar um container antigo preso a uma imagem que já foi removida localmente.

### ⏪ Rollback imediato

Se a nova versão derrubar o site, volte imediatamente ao último commit estável:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile

git log --oneline -5
git reset --hard <commit_estavel>

docker-compose -f docker-compose.blog.yml up -d --build
docker network connect al_profile_al-profile-network nginx-proxy-app-1 2>/dev/null || true

curl -I http://localhost:3003/
curl -I https://adriano-lengruber.com/
```

Após o rollback, reverta também a branch `master` no GitHub para evitar que o próximo deploy reaplique a versão problemática.

### 🔍 Diagnóstico de tela branca ou indisponibilidade

Se após o deploy a página continuar em branco ou indisponível:

1.  **Inspecionar Console (F12)**: Verifique se há erros de carregamento de scripts (404 ou 500) ou erros de sintaxe JS.
2.  **Verificar Logs na VPS**:
    ```bash
    # Ver logs do frontend
    docker logs al-profile-frontend
    
    # Ver logs do Nginx Proxy Manager (se houver erro de Gateway)
    docker logs nginx-proxy-app-1
    ```
3.  **Confirmar nomes de containers**:
    ```bash
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ```
4.  **Validar o frontend por dentro da VPS**:
    ```bash
    curl -I http://localhost:3003/
    ```
5.  **Validar resolução entre Nginx Proxy Manager e frontend**:
    ```bash
    docker exec nginx-proxy-app-1 getent hosts al-profile-frontend
    ```
6.  **Reconectar a rede do Nginx Proxy Manager se necessário**:
    ```bash
    docker network connect al_profile_al-profile-network nginx-proxy-app-1 2>/dev/null || true
    ```

---

## Verificação final

Após configurar, verifique se:
1. O site está acessível em: https://adriano-lengruber.com
2. A API responde em: https://api.adriano-lengruber.com/api/posts
