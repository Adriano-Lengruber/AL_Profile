# 🌐 AL_Profile Ecosystem - Adriano Lengruber

[![Status](https://img.shields.io/badge/status-ativo-success)](#)
[![Tech Stack](https://img.shields.io/badge/tech-React%20%2B%20TypeScript%20%2B%20Node.js%20%2B%20MongoDB-blue)](#)
[![Domain](https://img.shields.io/badge/domain-adriano--lengruber.com-gold)](https://adriano-lengruber.com)

Este repositório contém o ecossistema digital completo de **Adriano Lengruber**, integrando um portal pessoal de alta performance, um blog técnico interativo e o **Work OS**, um sistema operacional administrativo robusto para gestão de consultoria.

---

## 🏗️ Estrutura do Ecossistema

### 1. 💎 Portal Pessoal ([adriano-lengruber.com](https://adriano-lengruber.com))
Uma vitrine tecnológica de alta performance focada em conversão e branding pessoal.
- **Visual Cyber/Gold**: Estética moderna com animações fluidas via Framer Motion.
- **Currículo Interativo**: Timeline de experiências, habilidades categorizadas e certificações.
- **Portfólio de Projetos**: Integração com a API do GitHub para exibição de repositórios em tempo real.
- **Experiência 3D**: Elementos interativos utilizando **Three.js** e **React Three Fiber**.

### 2. ✍️ Blog Técnico
Plataforma de compartilhamento de conhecimento integrada.
- **Conteúdo Dinâmico**: Posts sobre Data Science, IA, Automação e BI.
- **Engajamento**: Sistema de likes e comentários persistentes via MongoDB.
- **SEO Optimized**: Estrutura focada em indexação e legibilidade.

### 3. 🚀 Work OS (Admin Dashboard)
O cérebro operacional para gestão de clientes e projetos.
- **Workspaces Estilo Monday.com**: Gestão granular de tarefas com quadros interativos.
- **CRM Avançado**: Pipeline de vendas, gestão de stakeholders e análise de briefing por IA.
- **Sincronização em Tempo Real**: Edição de células com persistência automática no MongoDB.
- **Gerador de Propostas**: Automação de documentos comerciais e conversão direta para projetos.

---

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** & **TypeScript**: Base sólida e tipada para a interface.
- **Vite**: Tooling de próxima geração para desenvolvimento rápido.
- **Tailwind CSS**: Estilização utilitária e responsiva.
- **Framer Motion**: Orquestração de animações complexas.
- **Three.js / React Three Fiber**: Renderização de elementos 3D interativos.
- **Lucide React**: Conjunto de ícones vetoriais modernos.

### Backend & Persistência
- **Node.js** & **Express**: API RESTful robusta.
- **MongoDB** & **Mongoose**: Armazenamento NoSQL escalável.
- **JWT (JSON Web Tokens)**: Autenticação segura de usuários.
- **Bcrypt.js**: Criptografia de ponta para segurança de dados.

### Qualidade & Testes
- **Vitest**: Framework de testes nativo para Vite.
- **React Testing Library**: Garantia de comportamento da interface.

---

## 🚀 Como Iniciar o Projeto

### Pré-requisitos
- Node.js (v18+)
- MongoDB (Instalação local ou cluster Atlas)
- pnpm ou npm

### Configuração
1. Clone este repositório.
2. Configure o arquivo `.env` na raiz:
```env
# Backend
MONGODB_URI=sua_uri_do_mongodb
JWT_SECRET=sua_chave_secreta

# Frontend
VITE_API_URL=http://localhost:3001/api
```

### Comandos Principais
```bash
# Instalar todas as dependências
npm install

# Rodar o Backend (API)
node server/index.js

# Rodar o Frontend (Portal + Work OS)
npm run dev

# Executar Testes Automatizados
npm test
```

---

## 🧪 Garantia de Qualidade
O projeto utiliza testes automatizados para validar fluxos críticos:
- **CRUD de Workspaces**: Criação, edição e exclusão de itens.
- **Sincronização de Dados**: Verificação do debounce e persistência no banco.
- **Fluxos de CRM**: Conversão de propostas e gestão de projetos.

---

## 📁 Organização do Código
- `/src/App.tsx`: Ponto de entrada e portal principal.
- `/src/pages/AdminDashboard.tsx`: Dashboard administrativa (Work OS).
- `/src/pages/BlogPage.tsx`: Interface do blog.
- `/src/test/`: Suíte de testes automatizados.
- `/server/index.js`: Lógica de API e modelos de dados.

---

## 👤 Autor
**Adriano Lengruber**
*Consultoria de Soluções Inteligentes | AI Agents & Automation Specialist*

- [Website](https://adriano-lengruber.com)
- [LinkedIn](https://linkedin.com/in/adriano-lengruber)
- [GitHub](https://github.com/Adriano-Lengruber)

---
*Transformando dados em decisões e processos em automação.*
