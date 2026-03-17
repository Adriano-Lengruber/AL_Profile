require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/al-profile-blog';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelos do MongoDB
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, default: '' },
  tags: [String],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  readTime: { type: String, default: '5 min' },
  createdAt: { type: Date, default: Date.now }
});

const commentSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, default: '' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);

// --- Novos Modelos para o Admin Work OS ---

const boardItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  values: mongoose.Schema.Types.Mixed,
  subitems: [this]
});

const boardGroupSchema = new mongoose.Schema({
  id: String,
  title: String,
  color: String,
  items: [boardItemSchema]
});

const boardColumnSchema = new mongoose.Schema({
  id: String,
  title: String,
  type: { type: String, enum: ['text', 'status', 'date', 'number', 'person', 'link', 'tags', 'priority', 'timeline'] },
  width: Number
});

const boardSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  columns: [boardColumnSchema],
  groups: [boardGroupSchema]
});

const workspaceSchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  boards: [boardSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const projectSchema = new mongoose.Schema({
  id: String,
  clientName: String,
  projectName: String,
  brief: String,
  status: String,
  value: Number,
  deadline: String,
  tasks: [{ id: String, title: String, status: String, startDate: String, endDate: String }],
  costs: [{ label: String, value: Number }],
  stakeholders: [{ name: String, role: String, influence: String, preference: String }],
  meetingNotes: [{ date: String, content: String }],
  documents: [{ id: String, name: String, type: { type: String }, date: String, size: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const companySchema = new mongoose.Schema({
  name: String,
  cnpj: String,
  address: String,
  email: String,
  phone: String,
  website: String,
  bio: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
const Project = mongoose.model('Project', projectSchema);
const Company = mongoose.model('Company', companySchema);

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Rotas de Autenticação
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário ou email já cadastrado' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Gerar token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// Update profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { avatar, bio } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;

    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

// Rotas de Posts
app.get('/api/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username avatar');

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
});

app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username avatar');
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
});

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, tags, readTime, imageUrl } = req.body;

    const user = await User.findById(req.user.id);

    const post = new Post({
      title,
      excerpt,
      content,
      imageUrl: imageUrl || '',
      author: user._id,
      authorName: user.username,
      authorAvatar: user.avatar,
      tags: tags || [],
      readTime: readTime || '5 min'
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar post', details: error.message });
  }
});

app.put('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    const { title, excerpt, content, tags, readTime, imageUrl } = req.body;
    
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (readTime) post.readTime = readTime;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar post' });
  }
});

app.delete('/api/posts/:id', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    await post.deleteOne();
    await Comment.deleteMany({ post: req.params.id });

    res.json({ message: 'Post deletado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar post' });
  }
});

// Likes
app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const userId = req.user.id;
    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      // Remover like
      post.likes.splice(likeIndex, 1);
      post.likesCount -= 1;
    } else {
      // Adicionar like
      post.likes.push(userId);
      post.likesCount += 1;
    }

    await post.save();

    res.json({ likesCount: post.likesCount, liked: likeIndex === -1 });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar like' });
  }
});

// Comentários
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('author', 'username avatar');
    
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

app.post('/api/posts/:id/comments', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const user = await User.findById(req.user.id);

    const comment = new Comment({
      post: post._id,
      author: user._id,
      authorName: user.username,
      authorAvatar: user.avatar,
      content
    });

    await comment.save();

    post.commentsCount += 1;
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário' });
  }
});

// Seed - Criar posts de exemplo (apenas para desenvolvimento)
app.post('/api/seed', async (req, res) => {
  try {
    // Verificar se já existem posts
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      return res.json({ message: 'Posts já existem', count: existingPosts });
    }

    // Criar usuário de exemplo ou usar existente
    let user = await User.findOne({ email: 'admin@example.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = new User({
        username: 'Admin',
        email: 'admin@example.com',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        bio: 'Desenvolvedor e Analista de Dados'
      });
      await user.save();
    }

    const samplePosts = [
      {
        title: 'Introdução ao Machine Learning com Python',
        excerpt: 'Aprenda os conceitos fundamentais de machine learning e como implementar seus primeiros modelos utilizando Python e bibliotecas populares como Scikit-learn.',
        content: `Machine Learning (Aprendizado de Máquina) é uma área da inteligência artificial que permite que sistemas aprendam e melhorem automaticamente a partir da experiência.

## Por que Python?

Python se tornou a linguagem padrão para Machine Learning devido à sua simplicidade e ao ecossistema robusto de bibliotecas:

- **NumPy**: Computação numérica
- **Pandas**: Manipulação de dados
- **Scikit-learn**: Algoritmos de ML
- **TensorFlow/PyTorch**: Deep Learning

## Primeiros Passos

Vamos criar um modelo simples de classificação:

\`\`\`python
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = RandomForestClassifier()
model.fit(X_train, y_train)
\`\`\`

## Conclusão

Machine Learning abre um mundo de possibilidades. Continue aprendendo e experimentando!`,
        imageUrl: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
        author: user._id,
        authorName: user.username,
        authorAvatar: user.avatar,
        tags: ['Machine Learning', 'Python', 'Data Science'],
        readTime: '10 min'
      },
      {
        title: 'ETL com Python: Do Básico ao Avançado',
        excerpt: 'Descubra como construir pipelines de ETL robustos utilizando Python, pandas e ferramentas modernas de orquestração.',
        content: `ETL (Extract, Transform, Load) é o processo fundamental para integração de dados em qualquer organização.

## O que é ETL?

- **Extract (Extrair)**: Coletar dados de múltiplas fontes
- **Transform (Transformar)**: Limpar, validar e converter dados
- **Load (Carregar)**: Armazenar no destino final

## Ferramentas Populares

### Pandas
Ideal para datasets de tamanho médio:

\`\`\`python
import pandas as pd

df = pd.read_csv('dados.csv')
df_clean = df.dropna()
df_clean.to_sql('tabela_clean', conn)
\`\`\`

### Apache Airflow
Para orquestração de pipelines complexos:

- Programação baseada em DAGs
- Monitoramento visual
- Retry automático

## Boas Práticas

1. Use logging adequado
2. Trate erros gracefully
3. Documente seu pipeline
4. Versione seus dados`,
        imageUrl: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop',
        author: user._id,
        authorName: user.username,
        authorAvatar: user.avatar,
        tags: ['ETL', 'Python', 'Data Engineering'],
        readTime: '15 min'
      },
      {
        title: 'Power BI: Criando Dashboards Impactantes',
        excerpt: 'Aprenda a criar dashboards profissionais no Power BI utilizando DAX avançado e visualizações personalizadas.',
        content: `Power BI é uma ferramenta de business intelligence da Microsoft que permite transformar dados em insights visuais.

## Fundamentos DAX

DAX (Data Analysis Expressions) é a linguagem de fórmulas do Power BI:

### Medidas vs Colunas Calculadas

- **Colunas Calculadas**: Valores por linha
- **Medidas**: Agregações dinâmicas

### Exemplos de DAX

\`\`\`dax
Total Vendas = SUM(Vendas[Valor])
Vendas YTD = TOTALYTD([Total Vendas], Calendario[Data])
Margem = DIVIDE([Lucro], [Total Vendas])
\`\`\`

## Visualização Eficaz

### Princípios de Design

1. **Clareza**: Dados devem ser facilmente compreensíveis
2. **Contexto**: Use tooltips e filtros
3. **Consistência**: Cores e formatos uniformes
4. **Interatividade**: Permita drill-through

## Conclusão

Um bom dashboard conta uma história com os dados. Pratique sempre!`,
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
        author: user._id,
        authorName: user.username,
        authorAvatar: user.avatar,
        tags: ['Power BI', 'DAX', 'Business Intelligence'],
        readTime: '10 min'
      },
      {
        title: 'Automação com n8n: Transforme Seu Fluxo de Trabalho',
        excerpt: 'Descubra como o n8n pode automatizar tarefas repetitivas e integrar seus sistemas de forma eficiente.',
        content: `n8n é uma ferramenta de automação de código aberto que permite conectar aplicativos e automatizar fluxos de trabalho.

## Por que n8n?

- Código aberto
- Interface visual intuitiva
- Hospedagem local (privacidade)
- Integrações ilimitadas

## Casos de Uso

### Automação de Leads

1. Novo lead no formulário → Cria registro no CRM
2. Envia email de boas-vindas
3. Notifica equipe no Slack

### Sincronização de Dados

1. Monitora planilha Google
2. Atualiza banco de dados
3. Gera relatório diário

## Primeiro Workflow

\`\`\`json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook"
    },
    {
      "name": "Slack",
      "type": "n8n-nodes-base.slack"
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Slack", "type": "main", "index": 0}]]
    }
  }
}
\`\`\`

## Conclusão

Automação economiza tempo e reduz erros. Comece simples e expanda gradualmente!`,
        imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop',
        author: user._id,
        authorName: user.username,
        authorAvatar: user.avatar,
        tags: ['Automação', 'n8n', 'Productivity'],
        readTime: '8 min'
      }
    ];

    await Post.insertMany(samplePosts);
    
    res.json({ message: 'Posts de exemplo criados com sucesso', count: samplePosts.length });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar posts', details: error.message });
  }
});

// --- Rotas Admin Work OS ---

// Workspaces
app.get('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const workspaces = await Workspace.find({ userId: req.user.id });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar workspaces' });
  }
});

app.post('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const workspace = new Workspace({ ...req.body, userId: req.user.id });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar workspace' });
  }
});

app.put('/api/workspaces/:id', authenticateToken, async (req, res) => {
  try {
    const workspace = await Workspace.findOneAndUpdate(
      { id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar workspace' });
  }
});

// Projects
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const project = new Project({ ...req.body, userId: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id, userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar projeto' });
  }
});

app.delete('/api/workspaces/:id', authenticateToken, async (req, res) => {
  try {
    await Workspace.findOneAndDelete({ id: req.params.id, userId: req.user.id });
    res.json({ message: 'Workspace removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover workspace' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    await Project.findOneAndDelete({ id: req.params.id, userId: req.user.id });
    res.json({ message: 'Projeto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover projeto' });
  }
});

// Company
app.get('/api/company', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados da empresa' });
  }
});

app.post('/api/company', authenticateToken, async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate(
      { userId: req.user.id },
      { ...req.body, userId: req.user.id },
      { upsert: true, new: true }
    );
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dados da empresa' });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
