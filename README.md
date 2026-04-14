# 🌐 AL_Profile Ecosystem - Adriano Lengruber

[![Status](https://img.shields.io/badge/status-ativo-success)](#)
[![Tech Stack](https://img.shields.io/badge/tech-React%20%2B%20TypeScript%20%2B%20Node.js%20%2B%20MongoDB-blue)](#)
[![Domain](https://img.shields.io/badge/domain-adriano--lengruber.com-gold)](https://adriano-lengruber.com)
[![Docker](https://img.shields.io/badge/docker-containerized-blue)](https://www.docker.com/)
[![Tests](https://img.shields.io/badge/tests-Playwright%20%2B%20Vitest-brightgreen)](#)

Este repositório contém o ecossistema digital completo de **Adriano Lengruber**, integrando um portal pessoal de alta performance, um blog técnico interativo e o **Work OS**, um sistema operacional administrativo robusto para gestão de consultoria e projetos.

---

## 🏗️ Estrutura do Ecossistema

### 1. 💎 Portal Pessoal ([adriano-lengruber.com](https://adriano-lengruber.com))
Uma vitrine tecnológica de alta performance focada em branding pessoal e conversão.
- **Visual Cyber/Gold**: Estética moderna com animações fluidas via Framer Motion.
- **Identidade Visual Atualizada**: Navbar e áreas principais usando a logomarca oficial `LOGO01.png`.
- **Navegação Refinada**: O item `Blog` da navbar aponta para a seção de blog da home, enquanto o CTA dourado leva para a página dedicada.
- **Currículo Interativo**: Timeline de experiências, habilidades categorizadas e certificações.
- **Portfólio de Projetos**: Integração com a API do GitHub para exibição de repositórios em tempo real.
- **Experiência 3D**: Elementos interativos utilizando **Three.js** e **React Three Fiber**.

### 2. ✍️ Blog Técnico
Plataforma de compartilhamento de conhecimento integrada.
- **Conteúdo Dinâmico**: Posts sobre Data Science, IA, Automação e BI.
- **Engajamento**: Sistema de likes e comentários persistentes via MongoDB.
- **SEO Optimized**: Estrutura focada em indexação e legibilidade.

### 3. 🚀 Work OS (Admin Dashboard)
O cérebro operacional para gestão de clientes e projetos, inspirado em ferramentas como Monday.com.
- **Business Intelligence**: Gráficos de performance e velocidade de receita via Recharts.
- **CRM Avançado**: Pipeline de vendas, gestão de stakeholders e análise de briefing.
- **Sincronização em Tempo Real**: Edição de células com persistência automática no MongoDB.
- **Gestão de Tarefas**: Quadros interativos para controle granular de atividades.

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** & **TypeScript**: Base sólida e tipada.
- **Vite**: Build tool de alta performance.
- **Tailwind CSS**: Estilização utilitária e responsiva.
- **Framer Motion**: Animações de interface.
- **Three.js / R3F**: Elementos 3D imersivos.

### Backend & Persistência
- **Node.js** & **Express**: API RESTful.
- **MongoDB** & **Mongoose**: Banco de dados NoSQL.
- **JWT**: Autenticação segura.
- **Bcrypt.js**: Criptografia de senhas.

### Infraestrutura & DevOps
- **Docker & Docker Compose**: Containerização completa do ecossistema.
- **Nginx**: Proxy reverso para roteamento de tráfego e SSL.
- **Nginx Proxy Manager**: Gestão simplificada de domínios e certificados.

---

## 🐳 Docker & Deployment

O projeto foi desenhado para rodar prioritariamente em containers Docker, garantindo paridade entre ambientes de desenvolvimento e produção.

### Subir o ambiente completo
```bash
docker-compose -f docker-compose.blog.yml up -d --build
```
Isso iniciará:
- **Frontend**: Acessível em [http://localhost:3003](http://localhost:3003)
- **Backend**: Acessível via proxy em [http://localhost:3003/api](http://localhost:3003/api)
- **MongoDB**: Banco de dados persistente.

### Deploy seguro na VPS
O deploy de produção agora usa a mesma rotina para atualização manual e automática, com:
- limpeza de containers órfãos com nomes antigos do Compose;
- subida em etapas (`mongodb` + `backend`, depois `frontend`);
- rollback automático para o último commit estável se algum healthcheck falhar;
- validação local e pública antes de concluir a atualização.

```bash
cd ~/AL_Profile
bash scripts/vps-safe-deploy.sh
```

### Arquitetura de Proxy
O Frontend utiliza um proxy reverso configurado no Nginx (`nginx.conf`) para encaminhar todas as requisições `/api` para o container do Backend, resolvendo problemas de CORS nativamente.

---

## 🚀 Desenvolvimento Local (Sem Docker)

Caso precise rodar fora do Docker para depuração rápida:

### Pré-requisitos
- Node.js (v18+)
- MongoDB local ou Atlas.

### Configuração
1. Configure o `.env` na raiz:
```env
MONGODB_URI=mongodb://localhost:27017/al_profile
JWT_SECRET=sua_chave_secreta
VITE_API_URL=http://localhost:3001/api
```

2. Comandos:
```bash
# Instalar dependências
npm install --legacy-peer-deps

# Rodar Backend
node server/index.js

# Rodar Frontend
npm run dev
```

---

## 🧪 Garantia de Qualidade (Testes)

O ecossistema conta com uma suíte de testes robusta para validar fluxos críticos.

### 1. Testes End-to-End (Playwright)
Validam o fluxo completo do usuário no ambiente Docker.
```bash
# Executar testes de Login e Dashboard
npx playwright test tests/dashboard.spec.ts --reporter=line
```

### 2. Testes Unitários e Integração (Vitest)
Validam componentes e lógica interna.
```bash
npm test
```

---

## 👤 Gestão de Usuários

Para facilitar o desenvolvimento, existe um script para criar ou resetar o usuário principal (**Lengruber**):

```bash
# No diretório raiz
node server/create-lengruber.cjs
```
**Credenciais Padrão (Ambiente de Teste):**
- **Usuário:** `adrianolengruber@hotmail.com`
- **Senha:** `AL_Password_2026`

---

## 📁 Organização do Código
- `/src/pages/AdminDashboard.tsx`: Core do Work OS.
- `/server/index.js`: API e modelos Mongoose.
- `/tests/`: Testes automatizados Playwright.
- `docker-compose.blog.yml`: Orquestração de containers.
- `/scripts/vps-safe-deploy.sh`: Rotina segura de deploy e rollback na VPS.
- `nginx.conf`: Configuração do servidor e proxy.

---

## 👤 Autor
**Adriano Lengruber**
*Consultoria de Soluções Inteligentes | AI Agents & Automation Specialist*

- [Website](https://adriano-lengruber.com)
- [LinkedIn](https://linkedin.com/in/adriano-lengruber)
- [GitHub](https://github.com/Adriano-Lengruber)

---
*Transformando dados em decisões e processos em automação.*
