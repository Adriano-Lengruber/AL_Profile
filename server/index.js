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
    const { title, excerpt, content, tags, readTime } = req.body;

    const user = await User.findById(req.user.id);

    const post = new Post({
      title,
      excerpt,
      content,
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

    const { title, excerpt, content, tags, readTime } = req.body;
    
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (tags) post.tags = tags;
    if (readTime) post.readTime = readTime;

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

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
