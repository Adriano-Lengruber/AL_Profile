# Configuração do Domínio no Nginx Proxy Manager

## DNS (Cloudflare) ✅
O DNS já está configurado:
- Tipo: A Record
- Nome: adriano-lengruber.com
- Valor: 148.230.75.59
- Proxy: Ativo (Proxied)

## Docker Compose - Atualização ✅
O arquivo docker-compose.blog.yml foi atualizado para incluir a rede do Nginx Proxy Manager.

## Fluxo recomendado de deploy ✅

O fluxo principal de produção passa a ser:

1. `git push origin master`
2. GitHub Actions executa o workflow `Deploy to VPS`
3. O workflow conecta na VPS via `appleboy/ssh-action` usando os segredos do repositório
4. A VPS executa `scripts/vps-safe-deploy.sh`

O caminho `scripts/deploy-vps.ps1` continua válido como operação manual, mas não deve ser o único mecanismo de publicação.

### Na VPS (Usuário: adriano), execute:

```bash
cd ~/AL_Profile
bash scripts/vps-safe-deploy.sh
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

## 🚀 GitHub Actions - Deploy Manual ✅

O workflow do GitHub foi simplificado para execução manual (`workflow_dispatch`), evitando deploy automático a cada `push` e reduzindo os falsos erros que estavam atrapalhando as atualizações.

### 🔑 Configuração Necessária (GitHub Secrets)

No seu repositório do GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

1.  **`SSH_HOST`**: `148.230.75.59`
2.  **`SSH_USER`**: `adriano`
3.  **`SSH_PRIVATE_KEY`**: Sua chave privada SSH que tem acesso à VPS.

### 📝 O que o workflow faz:
1. Conecta via SSH na VPS.
2. Executa `scripts/vps-safe-deploy.sh` na própria VPS.
3. Atualiza o repositório local para `origin/master`.
4. Remove containers órfãos antigos que costumam causar conflito de nomes no Compose.
5. Sobe `mongodb` e `backend` primeiro, aguarda healthcheck, e só depois recria o `frontend`.
6. Reconecta a rede do Nginx Proxy Manager se necessário.
7. Valida frontend local, proxy local e API local.
8. Faz checks públicos como aviso, sem derrubar a stack por falso negativo.
9. Se alguma validação local falhar, volta automaticamente ao commit anterior e recompõe a stack.

### ▶️ Quando o workflow executa

- Automaticamente em `push` para `master` quando há mudanças relevantes de aplicação, infraestrutura ou scripts de deploy.
- Manualmente por `workflow_dispatch`, para reprocessar um deploy sem criar novo commit.

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

### ✅ Procedimento padrão daqui em diante

Para evitar repetir o problema de depender de uma sessão local específica:

1. Validar localmente.
2. Fazer `commit`.
3. Fazer `git push origin master`.
4. Acompanhar o workflow `Deploy to VPS` no GitHub Actions.
5. Só usar `scripts/deploy-vps.ps1` quando for realmente necessário executar o deploy manual fora do GitHub.

### ✅ Garantias do deploy manual

O workflow foi ajustado para evitar o cenário em que o repositório é atualizado, mas os containers ficam parados:

1. Não executa mais `docker stop` e `docker rm` na stack inteira antes do build.
2. Remove apenas containers órfãos problemáticos do Compose e mantém o rollback pronto.
3. Recria a stack em etapas para evitar o frontend subir antes de o backend responder.
4. Falhando o build ou qualquer health check, executa rollback automático para o commit anterior.
5. O deploy só depende dos checks locais críticos; os checks públicos viram aviso para não quebrar atualizações boas.

### 🚀 Atualização manual segura na VPS

Quando for necessário atualizar manualmente, siga esta ordem:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile
bash scripts/vps-safe-deploy.sh
```

Só considere a atualização concluída se o script terminar sem erro.

### 🔐 SMTP e segredos de produção

As credenciais sensíveis do backend devem ficar em `server/.env.runtime` na VPS, fora do Git. Use `server/.env.runtime.example` como base.

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
docker rm -f <container_orfao> 2>/dev/null || true
bash scripts/vps-safe-deploy.sh
```

Esse erro acontece quando o Docker tenta recriar um container antigo preso a uma imagem que já foi removida localmente.

### ⏪ Rollback imediato

Se a nova versão derrubar o site, volte imediatamente ao último commit estável:

```bash
ssh adriano@148.230.75.59
cd ~/AL_Profile

git log --oneline -5
git reset --hard <commit_estavel>

bash scripts/vps-safe-deploy.sh
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

## Atualizações recentes da interface

- A navbar da home agora permanece translúcida no scroll, sem contorno perceptível.
- O item `Blog` da navbar agora é uma âncora para a seção de blog da home.
- A logomarca oficial `LOGO01.png` foi aplicada nas áreas principais do portfólio e do blog.
