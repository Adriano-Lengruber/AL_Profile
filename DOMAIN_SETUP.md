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
# Parar os containers
cd ~/AL_Profile
docker-compose -f docker-compose.blog.yml down
```

# Recriar os containers com a nova rede
docker-compose -f docker-compose.blog.yml up -d
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

Para o Nginx Proxy Manager alcançar os containers Docker, a rede já foi conectada:

```bash
# Comando executado:
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

---

## Verificação final

Após configurar, verifique se:
1. O site está acessível em: https://adriano-lengruber.com
2. A API responde em: https://api.adriano-lengruber.com/api/posts
