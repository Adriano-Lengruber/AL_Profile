# Plano de Evolução do Portfólio AL

## Visão Geral
Este documento apresenta o plano de evoluções para o portfólio de Adriano Lengruber, abordando todos os pontos levantados para melhoria da experiência do usuário e funcionalidades.

## Status Atual
- **Tipo**: Landing Page única (React + TypeScript + Vite + Tailwind CSS)
- **Frameworks**: Radix UI, Framer Motion, Three.js
- **Seções atuais**: Hero, Sobre, Serviços, Currículo, Projetos, Blog, Contato

## Atualização da Plataforma Colaborativa

### Escopo Entregue
- Painel `/admin` preparado para múltiplos atores com distinção entre **Owner** e **Colaboradores aprovados**
- Convites administrativos aprovados por e-mail com vínculo ao login/cadastro do usuário
- Permissões granulares por módulo para dashboard, CRM, projetos, workspaces, empresa, financeiro, conteúdo, servidor e equipe
- Interface inicial de **Equipe & Permissões** no Admin Dashboard para aprovar convites, revisar papéis e revogar acessos
- Feedback visual para contas autenticadas sem liberação administrativa, evitando acesso indevido aos módulos internos

### Papéis Atualmente Suportados
- **owner**: acesso total ao ambiente e gestão da equipe
- **manager**: visão ampla operacional/comercial com edição das áreas permitidas
- **editor**: foco em execução e atualização do dia a dia
- **viewer**: leitura controlada sem ações críticas

### Regras de Acesso
- O e-mail definido como owner no backend continua sendo a autoridade principal do ambiente
- Colaboradores só entram no admin quando o convite estiver aceito/aprovado
- Ações críticas agora respeitam permissão antes de carregar dados, sincronizar ou exibir botões destrutivos
- A aba de equipe fica reservada ao owner com permissão de gerenciamento

### Fluxo Operacional
1. Owner aprova um colaborador e gera o link de acesso
2. O colaborador faz login/cadastro com o mesmo e-mail aprovado
3. O backend resolve o contexto administrativo e devolve o pacote de permissões
4. O frontend libera apenas os módulos compatíveis com o papel e as flags ativas

### Pontos de Backend e Frontend Afetados
- **Backend**: `server/index.js` concentra convites, colaboração, roles, permissions e bloqueios por endpoint
- **Frontend**: `src/pages/AdminDashboard.tsx` aplica a leitura das permissões, a navegação condicional e a gestão inicial da equipe
- **Auth**: `src/hooks/auth-context.ts` mantém o contrato de `adminAccess` usado em toda a experiência autenticada

### Validação Executada
- Diagnósticos da IDE sem erros
- `npx eslint src server --ext .ts,.tsx,.js,.cjs`
- `npx tsc -b`

---

## 1. Git e Versionamento
### Ação Necessária
- Verificar se repositório Git existe
- Se não existir, inicializar com commit inicial

---

## 2. Melhorias nos Cards de Serviços ("O que eu Ofereço")

### Problema Atual
- Cards com espaço limitado
- Habilidades Técnicas competindo espaço com experiência profissional

### Solução Proposta
1. **Adicionar mais itens** em cada card:
   - **Ciência de Dados**: Python, SQL, Machine Learning, Análise Estatística, Visualização, ETL
   - **AI Agents**: LLM Integration, Workflow Automation, RAG, NLP, AutoGPT, LangChain
   - **Business Intelligence**: Power BI, DAX, KPIs, SAP/ERP, Looker, Tableau
   - **Automação & RPA**: Power Automate, Web Scraping, Python Scripts, APIs
   - **Desenvolvimento Full-Stack**: React, TypeScript, FastAPI, Node.js, PostgreSQL, Deploy
   - ~~Marketing Digital~~ → **DevOps**: VPS, Docker, Nginx, CI/CD, Cloud AWS/GCP/Azure, Linux Server

2. **Adicionar badges de Habilidades Técnicas** em cada card:
   - AI Agents: Badge "Python" | Badge "LangChain"
   - BI: Badge "Power BI" | Badge "DAX"
   - Automação: Badge "RPA" | Badge "Python"
   - Full-Stack: Badge "React" | Badge "TypeScript"
   - DevOps: Badge "Docker" | Badge "AWS"

---

## 3. Timeline de Experiência Profissional

### Problema Atual
- Timeline vertical simples
- Experiência profissional disputando espaço com habilidades técnicas

### Solução Proposta (Timeline Vertical Alternada)
```
     ┌─────────────┐
     │  2024-Atual│ ← Card Centralizado (maior)
     │  Freelancer │
     └──────┬──────┘
            │
     ┌──────┴──────┐
     │ 2025        │ ← Card à esquerda
     │ Global RJ   │
┌────┴─────┐  ┌────┴────┐
│  2023-25 │  │ 2021-21│ ← Cards intercalados
│  Infotec │  │  HCB   │
└──────────┘  └────────┘
```

- **Ordenação**: Mais recente para mais antigo (top to bottom)
- **Card atual**: Centralizado e destacado
- **Cards antigos**: Alternando esquerda/direita
- **Estilo visual**: Linha central conectando todos os cards

---

## 4. Formação Acadêmica - Seção Separada

### Problema Atual
- Formação acadêmica está dentro da seção de Currículo junto com habilidades

### Solução Proposta
- Criar **seção独立的** logo após Experiência Profissional
- Layout em cards ou linha do tempo horizontal
- Destaque para formação mais recente

### Dados Atuais (extraídos do código)
```typescript
const education = [
  { 
    title: 'Pós-graduação Lato Sensu', 
    school: 'Faculdade Líbano', 
    degree: 'Business Intelligence, Big Data e Analytics — Ciência de Dados', 
    period: '2024 - 2025' 
  },
  { 
    title: 'Bootcamp', 
    school: 'SoulCode', 
    degree: 'Analista de Dados', 
    period: '2023' 
  },
  { 
    title: 'Bacharel', 
    school: 'Universidade Iguaçu', 
    degree: 'Sistemas de Informação', 
    period: '2004 - 2007' 
  },
  { 
    title: 'Técnico', 
    school: 'Wall Escola Técnica', 
    degree: 'Tecnologia da Informação', 
    period: '2008 - 2010' 
  },
];
```

---

## 5. Carrossel de Certificações

### Problema Atual
- Certificações aparecem apenas como lista simples no currículo

### Solução Proposta
- **Nova seção dedicada** após Formação Acadêmica
- **Carrossel de cards** com:
  - Logo/Selo da certificação
  - Título curto
  - Descrição breve
  - Data de obtenção
  - Link para verificação (se aplicável)

### Dados Atuais
```typescript
const certs = [
  'Power BI para Análise de Dados',
  'Fundamentos de Python',
  'Implementando Banco de Dados',
  'Classificação e Tratamento da Informação'
];
```

### Sugestão de Expansão
- Adicionar logos reais das certificações
- Adicionar mais certificações relevantes
- Adicionar campo de descrição curta

---

## 6. Integração com GitHub Real

### Problema Atual
- Repositórios hardcoded no código
- Não mostra projetos reais do GitHub

### Solução Proposta
1. **API GitHub** - Buscar repositórios reais do usuário:
   ```
   GET https://api.github.com/users/{username}/repos
   ```

2. **Campos a exibir**:
   - Nome do repositório
   - Descrição
   - Linguagem principal (com cor)
   - Estrelas
   - Forks
   - Topics/Tags

3. **Fallback**: Manter repositórios estáticos como backup

### Dados do GitHub
- **Username atual no código**: `Adriano-Lengruber`

---

## 7. Blog + Mini Rede Social

### Problema Atual
- Blog apenas como seção na landing page
- Funcionalidades sociais não implementadas

### Solução Proposta

#### A) Página Dedicada de Blog
- `/blog` - Nova rota
- Lista de posts com paginação
- Busca por tags
- Ordenação por data/popularidade

#### B) Landing Page - Últimos Posts
- Manter 3-4 posts mais recentes na home
- Link "Ver todos os posts" → página completa

#### C) Mini Rede Social
Implementar sistema completo de interação:

**Funcionalidades**:
- [ ] Login via Email + Google Auth
- [ ] Like/Curtir posts ❤️
- [ ] Comentários 💬
- [ ] Compartilhar posts 🔗
- [ ] Sistema de editor/redator

**Stack Sugerida**:
- Autenticação: Supabase Auth (já incluso nas dependências)
- Banco de dados: Supabase (PostgreSQL)
- Estado: React Query ou Zustand

#### D) Estrutura de Dados (Supabase)
```sql
-- Tabela de posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title TEXT,
  excerpt TEXT,
  content TEXT,
  author_id UUID,
  created_at TIMESTAMP,
  published BOOLEAN
);

-- Tabela de likes
CREATE TABLE post_likes (
  id UUID PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  created_at TIMESTAMP
);

-- Tabela de comentários
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  post_id UUID,
  user_id UUID,
  content TEXT,
  created_at TIMESTAMP
);
```

---

## 8. Correção dos Ícones de Redes Sociais

### Problema Atual
- Instagram usa texto "IG" em vez de ícone
- WhatsApp não está presente

### Solução Proposta
1. **Corrigir ícone do Instagram**: Usar `<Instagram size={19} />` do lucide-react
2. **Adicionar WhatsApp**: Adicionar novo item com `<WhatsApp size={19} />` ou `<MessageCircle size={19} />`
3. **Alinhar ícones**: Organizar grid de ícones

---

## 9. Seção "Junte-se à Comunidade"

### Problema Atual
- Botões de CTA existem mas não funcionam

### Solução Proposta
- Conectar com a funcionalidade de login do blog
- Botões para: Login, Registrar, Participar

---

## Próximos Passos

1. **Fase 1** (Quick Wins):
   - Corrigir ícones de redes sociais
   - Substituir "Marketing Digital" por "DevOps"
   - Adicionar badges nos cards

2. **Fase 2** (Estrutura):
   - Separar Formação Acadêmica em seção própria
   - Implementar timeline de experiência profissional
   - Criar carrossel de certificações

3. **Fase 3** (Integrações):
   - Conectar GitHub API
   - Criar página de blog dedicada
   - Implementar sistema de autenticação

4. **Fase 4** (Rede Social):
   - Configurar Supabase
   - Implementar likes, comentários, compartilhamento
   - Sistema de editores/redatores
