# 🚀 AL_Profile - Portfólio Profissional

Portfólio profissional moderno e interativo construído com React, TypeScript, Tailwind CSS e Node.js/Express com MongoDB.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![Tech Stack](https://img.shields.io/badge/tech-React%20%2B%20TypeScript%20%2B%20Node.js-green)

## ✨ Features

### Frontend
- 🎨 Design moderno com tema cyber/gold
- 📱 Totalmente responsivo (mobile-first)
- ✨ Animações suaves com Framer Motion
- 🔗 Tech Stack interativo com scroll automático e manual
- 📝 Blog com posts recentes
- 📧 Formulário de contato funcional
- 🌐 Integração com API do GitHub

### Backend (Em Desenvolvimento)
- 🔐 Sistema de autenticação JWT
- 📝 API REST para Blog
- 💬 Sistema de posts, likes e comentários
- 👤 Sistema de usuários e perfis

## 🛠️ Tecnologias

### Frontend
- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Lucide React** - Ícones

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados
- **Mongoose** - ODM MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas

## 🚀 Como Executar

### Frontend
```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev
```

### Backend com Docker
```bash
# Subir containers (MongoDB + API)
docker-compose -f docker-compose.blog.yml up -d

# A API estará disponível em: http://localhost:3003/api
```

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
VITE_API_URL=http://localhost:3003/api
```

## 📁 Estrutura do Projeto

```
AL_Profile/
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/         # Custom hooks (useAuth)
│   ├── lib/           # Utilitários
│   ├── pages/         # Páginas (BlogPage)
│   ├── App.tsx        # Componente principal
│   └── main.tsx      # Entry point
├── server/            # Backend Node.js/Express
│   ├── index.js       # Servidor API
│   ├── package.json   # Dependências
│   └── Dockerfile     # Container Docker
├── docker-compose.blog.yml  # Docker Compose
└── README.md
```

## 🔗 Links Úteis

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3003/api
- **GitHub**: https://github.com/Adriano-Lengruber

## 🚀 Deploy na VPS

### Atualizar código na VPS:
```bash
# Já na pasta do projeto (/opt/AL_Profile)
git pull origin master
```

### Subir containers:
```bash
# Build e iniciar (modo desenvolvimento local)
docker-compose -f docker-compose.blog.yml up -d --build

# Ou usar o Dockerfile direto:
docker build -t al-profile .
docker run -d -p 3003:80 --name al-profile al-profile
```

### Comandos úteis:
```bash
# Ver logs
docker logs al-profile

# Parar container
docker stop al-profile

# Remover container
docker rm al-profile

# Ver containers rodando
docker ps
```

## 📄 Licença

MIT License - Feel free to use this project as a template!

---

Desenvolvido por [Adriano Lengruber](https://github.com/Adriano-Lengruber)
