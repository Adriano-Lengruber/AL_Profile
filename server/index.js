require('dotenv').config();
const os = require('os');
const crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const ADMIN_OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || 'adrianolengruber@hotmail.com').trim().toLowerCase();
const APP_URL = (process.env.APP_URL || '').trim();
const CONTACT_NOTIFICATION_TO = (process.env.CONTACT_NOTIFICATION_TO || 'contato@adriano-lengruber.com').trim();
const SMTP_HOST = (process.env.SMTP_HOST || '').trim();
const SMTP_PORT = Number(process.env.SMTP_PORT || 465);
const SMTP_SECURE = String(process.env.SMTP_SECURE || 'true').trim().toLowerCase() !== 'false';
const SMTP_USER = (process.env.SMTP_USER || '').trim();
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM_EMAIL = (process.env.SMTP_FROM_EMAIL || SMTP_USER || CONTACT_NOTIFICATION_TO).trim();
const SMTP_FROM_NAME = (process.env.SMTP_FROM_NAME || 'Site Adriano Lengruber').trim();

const PERMISSION_KEYS = [
  'dashboardView',
  'crmView',
  'projectsView',
  'projectsEdit',
  'workspacesView',
  'workspacesEdit',
  'companyView',
  'companyEdit',
  'financeView',
  'postsEdit',
  'serverView',
  'teamManage'
];

const EMPTY_PERMISSIONS = Object.freeze(PERMISSION_KEYS.reduce((acc, key) => {
  acc[key] = false;
  return acc;
}, {}));

const FULL_PERMISSIONS = Object.freeze(PERMISSION_KEYS.reduce((acc, key) => {
  acc[key] = true;
  return acc;
}, {}));

const ROLE_PERMISSIONS = {
  owner: { ...FULL_PERMISSIONS },
  manager: {
    dashboardView: true,
    crmView: true,
    projectsView: true,
    projectsEdit: true,
    workspacesView: true,
    workspacesEdit: true,
    companyView: true,
    companyEdit: true,
    financeView: true,
    postsEdit: true,
    serverView: false,
    teamManage: false
  },
  editor: {
    dashboardView: true,
    crmView: true,
    projectsView: true,
    projectsEdit: true,
    workspacesView: true,
    workspacesEdit: false,
    companyView: true,
    companyEdit: false,
    financeView: false,
    postsEdit: true,
    serverView: false,
    teamManage: false
  },
  finance: {
    dashboardView: true,
    crmView: false,
    projectsView: true,
    projectsEdit: false,
    workspacesView: false,
    workspacesEdit: false,
    companyView: true,
    companyEdit: false,
    financeView: true,
    postsEdit: false,
    serverView: false,
    teamManage: false
  },
  viewer: {
    dashboardView: true,
    crmView: true,
    projectsView: true,
    projectsEdit: false,
    workspacesView: true,
    workspacesEdit: false,
    companyView: true,
    companyEdit: false,
    financeView: true,
    postsEdit: false,
    serverView: false,
    teamManage: false
  }
};

const normalizeEmail = (value) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const normalizePhone = (value) => typeof value === 'string' ? value.trim() : '';
const isSmtpConfigured = () => !!(SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && CONTACT_NOTIFICATION_TO);
let smtpTransporter;

const getSmtpTransporter = () => {
  if (!smtpTransporter) {
    smtpTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    });
  }

  return smtpTransporter;
};

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const formatContactMessageHtml = ({ name, email, whatsapp, subject, message, createdAt }) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
    <h2 style="margin-bottom: 16px;">Novo contato recebido pelo site</h2>
    <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>WhatsApp:</strong> ${escapeHtml(whatsapp)}</p>
    <p><strong>Assunto:</strong> ${escapeHtml(subject)}</p>
    <p><strong>Data:</strong> ${escapeHtml(new Date(createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }))}</p>
    <hr style="margin: 24px 0; border: 0; border-top: 1px solid #e5e7eb;" />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  </div>
`;

const formatContactMessageText = ({ name, email, whatsapp, subject, message, createdAt }) => [
  'Novo contato recebido pelo site',
  '',
  `Nome: ${name}`,
  `Email: ${email}`,
  `WhatsApp: ${whatsapp}`,
  `Assunto: ${subject}`,
  `Data: ${new Date(createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}`,
  '',
  'Mensagem:',
  message
].join('\n');

const sendContactNotification = async (contactMessage) => {
  if (!isSmtpConfigured()) {
    return { sent: false, status: 'skipped', error: 'SMTP nao configurado.' };
  }

  try {
    const transporter = getSmtpTransporter();

    await transporter.sendMail({
      from: `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`,
      to: CONTACT_NOTIFICATION_TO,
      replyTo: `${contactMessage.name} <${contactMessage.email}>`,
      subject: `[Site] Novo contato: ${contactMessage.subject}`,
      text: formatContactMessageText(contactMessage),
      html: formatContactMessageHtml(contactMessage)
    });

    return { sent: true, status: 'sent', error: '' };
  } catch (error) {
    return {
      sent: false,
      status: 'failed',
      error: error instanceof Error ? error.message : 'Falha ao enviar notificacao por email.'
    };
  }
};

const sanitizePermissions = (permissions, role = 'viewer') => {
  const base = ROLE_PERMISSIONS[role] || EMPTY_PERMISSIONS;
  return PERMISSION_KEYS.reduce((acc, key) => {
    acc[key] = typeof permissions?.[key] === 'boolean' ? permissions[key] : !!base[key];
    return acc;
  }, {});
};

const getBaseAppUrl = (req) => APP_URL || req.headers.origin || `${req.protocol}://${req.get('host')}`;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/contact', async (req, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = normalizeEmail(req.body?.email);
    const whatsapp = normalizePhone(req.body?.whatsapp);
    const subject = typeof req.body?.subject === 'string' ? req.body.subject.trim() : '';
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';

    if (!name || !email || !whatsapp || !subject || !message) {
      return res.status(400).json({ error: 'Preencha nome, email, WhatsApp, assunto e mensagem.' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Informe um email valido.' });
    }

    if (whatsapp.replace(/\D/g, '').length < 10) {
      return res.status(400).json({ error: 'Informe um WhatsApp valido com DDD.' });
    }

    if (message.length < 10) {
      return res.status(400).json({ error: 'A mensagem precisa ter pelo menos 10 caracteres.' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      whatsapp,
      subject,
      message,
      source: 'website'
    });

    const notificationResult = await sendContactNotification({
      id: contactMessage._id.toString(),
      name,
      email,
      whatsapp,
      subject,
      message,
      createdAt: contactMessage.createdAt
    });

    await ContactMessage.findByIdAndUpdate(contactMessage._id, {
      notificationStatus: notificationResult.status,
      notificationError: notificationResult.error,
      notifiedAt: notificationResult.sent ? new Date() : null
    });

    res.status(201).json({
      ok: true,
      message: 'Mensagem recebida com sucesso.',
      emailNotificationSent: notificationResult.sent
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar mensagem de contato.', details: error.message });
  }
});

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

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  whatsapp: { type: String, required: true, trim: true },
  subject: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  source: { type: String, default: 'website' },
  status: { type: String, enum: ['new', 'read'], default: 'new' },
  notificationStatus: { type: String, enum: ['pending', 'sent', 'failed', 'skipped'], default: 'pending' },
  notificationError: { type: String, default: '' },
  notifiedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Comment = mongoose.model('Comment', commentSchema);
const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);

// --- Novos Modelos para o Admin Work OS ---

const boardItemSchema = new mongoose.Schema();
boardItemSchema.add({
  id: String,
  name: String,
  values: mongoose.Schema.Types.Mixed,
  subitems: [boardItemSchema]
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
  accesses: {
    type: [{ label: String, type: String, credentials: String }],
    default: []
  },
  tasks: {
    type: [{ id: String, title: String, status: String, startDate: String, endDate: String }],
    default: []
  },
  costs: {
    type: [{ label: String, value: Number }],
    default: []
  },
  stakeholders: {
    type: [{ name: String, role: String, influence: String, preference: String }],
    default: []
  },
  meetingNotes: {
    type: [{
      date: String,
      content: String,
      title: String,
      kind: String,
      outcome: String,
      nextStep: String
    }],
    default: []
  },
  documents: {
    type: [{ id: String, name: String, type: { type: String }, date: String, size: String }],
    default: []
  },
  stage: {
    type: String,
    default: 'proposal'
  },
  nextAction: {
    type: String,
    default: ''
  },
  followUpDate: {
    type: String,
    default: ''
  },
  workflowSteps: {
    type: [{ id: String, title: String, area: String, done: Boolean }],
    default: []
  },
  postDeliverySteps: {
    type: [{ id: String, title: String, area: String, done: Boolean }],
    default: []
  },
  playbook: {
    templateId: {
      type: String,
      default: 'consulting'
    },
    steps: {
      type: [{ id: String, title: String, description: String, done: Boolean }],
      default: []
    }
  },
  financials: {
    proposalValue: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      default: 'A definir'
    },
    invoiceStatus: {
      type: String,
      default: 'pending'
    },
    installments: {
      type: [{ id: String, label: String, amount: Number, dueDate: String, status: String }],
      default: []
    }
  },
  approval: {
    contractStatus: {
      type: String,
      default: 'draft'
    },
    approvalStatus: {
      type: String,
      default: 'pending'
    },
    signatureProvider: {
      type: String,
      default: 'manual'
    },
    contractUrl: {
      type: String,
      default: ''
    },
    signatureUrl: {
      type: String,
      default: ''
    },
    scopeSummary: {
      type: String,
      default: ''
    },
    approvalDeadline: {
      type: String,
      default: ''
    },
    signedAt: {
      type: String,
      default: ''
    },
    approvedAt: {
      type: String,
      default: ''
    }
  },
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
  bankInfo: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const collaborationSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  email: { type: String, required: true, lowercase: true, trim: true },
  token: { type: String, required: true, unique: true },
  role: { type: String, enum: ['manager', 'editor', 'finance', 'viewer'], default: 'viewer' },
  permissions: {
    type: {
      dashboardView: Boolean,
      crmView: Boolean,
      projectsView: Boolean,
      projectsEdit: Boolean,
      workspacesView: Boolean,
      workspacesEdit: Boolean,
      companyView: Boolean,
      companyEdit: Boolean,
      financeView: Boolean,
      postsEdit: Boolean,
      serverView: Boolean,
      teamManage: Boolean
    },
    default: () => ({ ...EMPTY_PERMISSIONS })
  },
  status: { type: String, enum: ['approved', 'accepted', 'revoked'], default: 'approved' },
  note: { type: String, default: '' },
  acceptedAt: { type: Date, default: null },
  revokedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
});

const Workspace = mongoose.model('Workspace', workspaceSchema);
const Project = mongoose.model('Project', projectSchema);
const Company = mongoose.model('Company', companySchema);
const Collaboration = mongoose.model('Collaboration', collaborationSchema);

const resolveActiveCollaboration = async (userDoc) => {
  if (!userDoc?._id) return null;

  const normalizedEmail = normalizeEmail(userDoc.email);
  const acceptedCollaboration = await Collaboration.findOne({
    status: 'accepted',
    $or: [
      { userId: userDoc._id },
      { email: normalizedEmail }
    ]
  }).sort({ acceptedAt: -1, createdAt: -1 });

  if (acceptedCollaboration) {
    if (!acceptedCollaboration.userId || String(acceptedCollaboration.userId) !== String(userDoc._id)) {
      acceptedCollaboration.userId = userDoc._id;
      await acceptedCollaboration.save();
    }

    return acceptedCollaboration;
  }

  const approvedCollaboration = await Collaboration.findOne({
    email: normalizedEmail,
    status: 'approved'
  }).sort({ createdAt: -1 });

  if (!approvedCollaboration) {
    return null;
  }

  approvedCollaboration.userId = userDoc._id;
  approvedCollaboration.status = 'accepted';
  approvedCollaboration.acceptedAt = new Date();
  approvedCollaboration.revokedAt = null;
  await approvedCollaboration.save();

  return approvedCollaboration;
};

const buildAccessPayload = async (userDoc) => {
  if (!userDoc) return null;

  const user = userDoc.toObject ? userDoc.toObject() : userDoc;
  const normalizedEmail = normalizeEmail(user.email);

  if (normalizedEmail === ADMIN_OWNER_EMAIL) {
    return {
      canAccessAdmin: true,
      isOwner: true,
      ownerId: String(user._id),
      role: 'owner',
      permissions: { ...FULL_PERMISSIONS }
    };
  }

  const collaboration = await resolveActiveCollaboration(user);

  if (!collaboration) {
    return {
      canAccessAdmin: false,
      isOwner: false,
      ownerId: null,
      role: 'community',
      permissions: { ...EMPTY_PERMISSIONS }
    };
  }

  return {
    canAccessAdmin: true,
    isOwner: false,
    ownerId: String(collaboration.ownerId),
    role: collaboration.role,
    permissions: sanitizePermissions(collaboration.permissions, collaboration.role),
    collaborationId: String(collaboration._id)
  };
};

const serializeUser = async (userDoc) => {
  const access = await buildAccessPayload(userDoc);
  return {
    id: userDoc._id,
    username: userDoc.username,
    email: userDoc.email,
    avatar: userDoc.avatar,
    bio: userDoc.bio,
    adminAccess: access
  };
};

const resolveAccessContext = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) return null;

  const access = await buildAccessPayload(user);
  return {
    user,
    ...access
  };
};

const hasPermission = (access, permission) => {
  if (!access?.canAccessAdmin) return false;
  if (access.isOwner) return true;
  return !!access.permissions?.[permission];
};

const requireAccess = async (req, res, permission) => {
  const access = await resolveAccessContext(req.user.id);

  if (!access?.user) {
    res.status(404).json({ error: 'Usuário não encontrado' });
    return null;
  }

  if (!access.canAccessAdmin) {
    res.status(403).json({ error: 'Acesso administrativo liberado apenas por convite aprovado' });
    return null;
  }

  if (permission && !hasPermission(access, permission)) {
    res.status(403).json({ error: 'Sem permissão para esta ação' });
    return null;
  }

  return access;
};

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
    const normalizedEmail = normalizeEmail(email);

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Usuário ou email já cadastrado' });
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = new User({
      username,
      email: normalizedEmail,
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
      user: await serializeUser(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário', details: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    // Buscar usuário
    const user = await User.findOne({ email: normalizedEmail });
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
      user: await serializeUser(user)
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
    res.json(await serializeUser(user));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário' });
  }
});

// --- System Stats Endpoint ---
app.get('/api/system/stats', authenticateToken, async (req, res) => {
  const access = await requireAccess(req, res, 'serverView');
  if (!access) return;

  const uptime = os.uptime();
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memUsage = ((totalMem - freeMem) / totalMem) * 100;
  
  const cpus = os.cpus();
  const loadAvg = os.loadavg();
  
  res.json({
    platform: os.platform(),
    release: os.release(),
    uptime: uptime,
    memory: {
      total: totalMem,
      free: freeMem,
      usage: memUsage.toFixed(2)
    },
    cpu: {
      model: cpus[0].model,
      cores: cpus.length,
      load: loadAvg
    },
    hostname: os.hostname(),
    arch: os.arch()
  });
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

    res.json(await serializeUser(user));
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

app.get('/api/collaborations', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res);
    if (!access) return;

    if (!access.isOwner) {
      return res.status(403).json({ error: 'Somente o proprietário pode gerenciar convites' });
    }

    const collaborations = await Collaboration.find({ ownerId: access.ownerId })
      .sort({ status: 1, createdAt: -1 })
      .populate('userId', 'username email avatar bio');

    const baseUrl = getBaseAppUrl(req);

    res.json({
      roleOptions: Object.keys(ROLE_PERMISSIONS).filter((role) => role !== 'owner'),
      collaborators: collaborations.map((item) => ({
        id: item._id,
        email: item.email,
        role: item.role,
        status: item.status,
        note: item.note,
        permissions: sanitizePermissions(item.permissions, item.role),
        createdAt: item.createdAt,
        acceptedAt: item.acceptedAt,
        inviteLink: item.status === 'approved' ? `${baseUrl}/admin?invite=${item.token}` : null,
        user: item.userId ? {
          id: item.userId._id,
          username: item.userId.username,
          email: item.userId.email,
          avatar: item.userId.avatar,
          bio: item.userId.bio
        } : null
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar colaboradores', details: error.message });
  }
});

app.post('/api/collaborations/invite', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res);
    if (!access) return;

    if (!access.isOwner) {
      return res.status(403).json({ error: 'Somente o proprietário pode aprovar colaboradores' });
    }

    const email = normalizeEmail(req.body.email);
    const role = Object.keys(ROLE_PERMISSIONS).includes(req.body.role) && req.body.role !== 'owner' ? req.body.role : 'viewer';
    const note = typeof req.body.note === 'string' ? req.body.note.trim() : '';

    if (!email) {
      return res.status(400).json({ error: 'Informe o e-mail do colaborador' });
    }

    if (email === ADMIN_OWNER_EMAIL) {
      return res.status(400).json({ error: 'Este e-mail já é o proprietário principal' });
    }

    const permissions = sanitizePermissions(req.body.permissions, role);
    const existingAccepted = await Collaboration.findOne({
      ownerId: access.ownerId,
      email,
      status: 'accepted'
    });

    if (existingAccepted) {
      existingAccepted.role = role;
      existingAccepted.permissions = permissions;
      existingAccepted.note = note;
      await existingAccepted.save();

      return res.json({
        message: 'Permissões do colaborador atualizadas com sucesso',
        collaboration: {
          id: existingAccepted._id,
          email: existingAccepted.email,
          role: existingAccepted.role,
          status: existingAccepted.status,
          note: existingAccepted.note,
          permissions: sanitizePermissions(existingAccepted.permissions, existingAccepted.role),
          inviteLink: null
        }
      });
    }

    await Collaboration.updateMany(
      { ownerId: access.ownerId, email, status: 'approved' },
      { status: 'revoked', revokedAt: new Date() }
    );

    const token = crypto.randomBytes(24).toString('hex');
    const collaboration = await Collaboration.create({
      ownerId: access.ownerId,
      invitedBy: access.user._id,
      email,
      token,
      role,
      permissions,
      note
    });

    res.status(201).json({
      message: 'Convite criado com sucesso',
      collaboration: {
        id: collaboration._id,
        email: collaboration.email,
        role: collaboration.role,
        status: collaboration.status,
        note: collaboration.note,
        permissions: sanitizePermissions(collaboration.permissions, collaboration.role),
        inviteLink: `${getBaseAppUrl(req)}/admin?invite=${collaboration.token}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar convite', details: error.message });
  }
});

app.put('/api/collaborations/:id', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res);
    if (!access) return;

    if (!access.isOwner) {
      return res.status(403).json({ error: 'Somente o proprietário pode alterar permissões' });
    }

    const collaboration = await Collaboration.findOne({ _id: req.params.id, ownerId: access.ownerId });

    if (!collaboration) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    const role = Object.keys(ROLE_PERMISSIONS).includes(req.body.role) && req.body.role !== 'owner' ? req.body.role : collaboration.role;
    collaboration.role = role;
    collaboration.permissions = sanitizePermissions(req.body.permissions, role);
    collaboration.note = typeof req.body.note === 'string' ? req.body.note.trim() : collaboration.note;
    await collaboration.save();

    res.json({
      message: 'Permissões atualizadas com sucesso',
      collaboration: {
        id: collaboration._id,
        email: collaboration.email,
        role: collaboration.role,
        status: collaboration.status,
        note: collaboration.note,
        permissions: sanitizePermissions(collaboration.permissions, collaboration.role),
        inviteLink: collaboration.status === 'approved' ? `${getBaseAppUrl(req)}/admin?invite=${collaboration.token}` : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar colaborador', details: error.message });
  }
});

app.delete('/api/collaborations/:id', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res);
    if (!access) return;

    if (!access.isOwner) {
      return res.status(403).json({ error: 'Somente o proprietário pode revogar acessos' });
    }

    const collaboration = await Collaboration.findOne({ _id: req.params.id, ownerId: access.ownerId });

    if (!collaboration) {
      return res.status(404).json({ error: 'Colaborador não encontrado' });
    }

    collaboration.status = 'revoked';
    collaboration.revokedAt = new Date();
    await collaboration.save();

    res.json({ message: 'Acesso revogado com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao revogar acesso', details: error.message });
  }
});

app.post('/api/collaborations/accept', authenticateToken, async (req, res) => {
  try {
    const token = typeof req.body.token === 'string' ? req.body.token.trim() : '';

    if (!token) {
      return res.status(400).json({ error: 'Convite inválido' });
    }

    const collaboration = await Collaboration.findOne({ token, status: 'approved' });
    if (!collaboration) {
      return res.status(404).json({ error: 'Convite não encontrado ou expirado' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (normalizeEmail(user.email) !== normalizeEmail(collaboration.email)) {
      return res.status(403).json({ error: 'Este convite pertence a outro e-mail' });
    }

    collaboration.userId = user._id;
    collaboration.status = 'accepted';
    collaboration.acceptedAt = new Date();
    collaboration.revokedAt = null;
    await collaboration.save();

    res.json({
      message: 'Convite aceito com sucesso',
      user: await serializeUser(user)
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aceitar convite', details: error.message });
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

    const access = await resolveAccessContext(req.user.id);
    const canModeratePost = hasPermission(access, 'postsEdit');

    if (post.author.toString() !== req.user.id && !canModeratePost) {
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

    const access = await resolveAccessContext(req.user.id);
    const canModeratePost = hasPermission(access, 'postsEdit');

    if (post.author.toString() !== req.user.id && !canModeratePost) {
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

// --- Seed Admin Work OS ---
app.post('/api/admin/seed-work-os', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'workspacesEdit');
    if (!access) return;

    if (!access.isOwner) {
      return res.status(403).json({ error: 'Somente o proprietário pode resetar o ambiente administrativo' });
    }

    const userId = access.ownerId;

    // 1. Limpar dados existentes do usuário
    await Workspace.deleteMany({ userId });
    await Project.deleteMany({ userId });
    await Company.deleteMany({ userId });

    // 2. Criar Empresa de Exemplo
    const sampleCompany = new Company({
      name: "Nexus Consulting Group",
      cnpj: "12.345.678/0001-90",
      address: "Av. Paulista, 1000, São Paulo - SP",
      email: "contato@nexusconsulting.com",
      phone: "(11) 98765-4321",
      website: "https://nexusconsulting.com",
      bio: "Líderes em transformação digital e inteligência de dados aplicada ao mercado financeiro e varejo.",
      userId
    });
    await sampleCompany.save();

    // 3. Criar Projetos Realistas
    const sampleProjects = [
      {
        id: "p-1",
        clientName: "TechBank Brasil",
        projectName: "Redesign UX/UI Portal",
        brief: "Modernização da experiência do usuário para o portal de investimentos.",
        status: "active",
        value: 45000,
        deadline: "2024-06-15",
        tasks: [
          { id: "t-1", title: "Pesquisa de Usuários", status: "finished", startDate: "2024-03-01", endDate: "2024-03-15" },
          { id: "t-2", title: "Wireframes", status: "active", startDate: "2024-03-16", endDate: "2024-04-10" }
        ],
        costs: [{ label: "Figma Pro", value: 150 }, { label: "Consultor Sênior", value: 5000 }],
        stakeholders: [{ name: "Ricardo Silva", role: "CTO", influence: "high", preference: "modern" }],
        meetingNotes: [{ date: "2024-03-10", content: "Definição de cores primárias concluída." }],
        userId
      },
      {
        id: "p-2",
        clientName: "Global Logistics",
        projectName: "Implementação CRM",
        brief: "Integração total do fluxo de vendas com Salesforce.",
        status: "active",
        value: 28000,
        deadline: "2024-05-20",
        userId
      },
      {
        id: "p-3",
        clientName: "Hospital Central",
        projectName: "Consultoria LGPD",
        brief: "Adequação completa às normas de proteção de dados.",
        status: "prospect",
        value: 15000,
        deadline: "A definir",
        userId
      },
      {
        id: "p-4",
        clientName: "Nexus",
        projectName: "Automação Financeira",
        brief: "Internalização e automação de fluxos de caixa.",
        status: "finished",
        value: 12000,
        deadline: "2024-03-01",
        userId
      },
      {
        id: "p-5",
        clientName: "RetailStore",
        projectName: "Análise de Dados Marketing",
        brief: "Dashboard de performance para campanhas de Ads.",
        status: "prospect",
        value: 8500,
        deadline: "A definir",
        userId
      },
      {
        id: "p-6",
        clientName: "SaaS Start",
        projectName: "Migração Cloud AWS",
        brief: "Escalabilidade e redução de custos em infraestrutura.",
        status: "active",
        value: 62000,
        deadline: "2024-08-10",
        userId
      }
    ];
    await Project.insertMany(sampleProjects);

    // 4. Criar Workspaces e Boards
    const sampleWorkspaces = [
      {
        id: "ws-1",
        name: "Pipeline Comercial",
        icon: "Target",
        userId,
        boards: [
          {
            id: "b-1",
            name: "Vendas 2024",
            description: "Acompanhamento de leads e propostas",
            columns: [
              { id: "c1", title: "Status", type: "status", width: 150 },
              { id: "c2", title: "Valor", type: "number", width: 120 },
              { id: "c3", title: "Prioridade", type: "priority", width: 100 }
            ],
            groups: [
              {
                id: "g-1",
                title: "Em Negociação",
                color: "#579BFC",
                items: [
                  { id: "i-1", name: "Proposta TechBank", values: { c1: "Em andamento", c2: 45000, c3: "Alta" } },
                  { id: "i-2", name: "Follow-up RetailStore", values: { c1: "Novo", c2: 8500, c3: "Média" } }
                ]
              }
            ]
          }
        ]
      },
      {
        id: "ws-2",
        name: "Gestão de Entregas",
        icon: "Briefcase",
        userId,
        boards: [
          {
            id: "b-2",
            name: "Projetos Ativos",
            columns: [
              { id: "c1", title: "Fase", type: "status", width: 150 },
              { id: "c2", title: "Prazo", type: "date", width: 150 }
            ],
            groups: [
              {
                id: "g-2",
                title: "Execution",
                color: "#22c55e",
                items: [
                  { id: "i-3", name: "Migração Cloud", values: { c1: "Execução", c2: "2024-08-10" } }
                ]
              }
            ]
          }
        ]
      }
    ];
    await Workspace.insertMany(sampleWorkspaces);

    res.json({ message: "Database Admin Work OS zerado e populado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao semear banco de dados Admin", details: error.message });
  }
});

// --- Rotas Admin Work OS ---

// Workspaces
app.get('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'workspacesView');
    if (!access) return;

    const workspaces = await Workspace.find({ userId: access.ownerId });
    res.json(workspaces);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar workspaces' });
  }
});

app.post('/api/workspaces', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'workspacesEdit');
    if (!access) return;

    const workspace = new Workspace({ ...req.body, userId: access.ownerId });
    await workspace.save();
    res.status(201).json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar workspace' });
  }
});

app.put('/api/workspaces/:id', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'workspacesEdit');
    if (!access) return;

    const workspace = await Workspace.findOneAndUpdate(
      { id: req.params.id, userId: access.ownerId },
      req.body,
      { new: true, upsert: true }
    );
    res.json(workspace);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar workspace' });
  }
});

// Projects
app.get('/api/public/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id }).lean();

    if (!project) {
      return res.status(404).json({ error: 'Projeto não encontrado' });
    }

    res.json({
      id: project.id,
      clientName: project.clientName,
      projectName: project.projectName,
      brief: project.brief,
      status: project.status,
      value: project.value,
      deadline: project.deadline,
      tasks: Array.isArray(project.tasks) ? project.tasks : [],
      meetingNotes: Array.isArray(project.meetingNotes) ? project.meetingNotes : [],
      documents: Array.isArray(project.documents) ? project.documents : [],
      stage: project.stage || 'proposal',
      nextAction: project.nextAction || '',
      followUpDate: project.followUpDate || '',
      workflowSteps: Array.isArray(project.workflowSteps) ? project.workflowSteps : [],
      financials: project.financials || {
        proposalValue: typeof project.value === 'number' ? project.value : 0,
        paymentMethod: 'A definir',
        invoiceStatus: 'pending',
        installments: []
      },
      approval: project.approval || {
        contractStatus: 'draft',
        approvalStatus: 'pending',
        signatureProvider: 'manual',
        contractUrl: '',
        signatureUrl: '',
        scopeSummary: project.brief || '',
        approvalDeadline: project.followUpDate || '',
        signedAt: '',
        approvedAt: ''
      },
      postDeliverySteps: Array.isArray(project.postDeliverySteps) ? project.postDeliverySteps : []
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projeto do portal' });
  }
});

app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'projectsView');
    if (!access) return;

    const projects = await Project.find({ userId: access.ownerId });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar projetos' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'projectsEdit');
    if (!access) return;

    const project = new Project({ ...req.body, userId: access.ownerId });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar projeto' });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'projectsEdit');
    if (!access) return;

    const project = await Project.findOneAndUpdate(
      { id: req.params.id, userId: access.ownerId },
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
    const access = await requireAccess(req, res, 'workspacesEdit');
    if (!access) return;

    await Workspace.findOneAndDelete({ id: req.params.id, userId: access.ownerId });
    res.json({ message: 'Workspace removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover workspace' });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'projectsEdit');
    if (!access) return;

    await Project.findOneAndDelete({ id: req.params.id, userId: access.ownerId });
    res.json({ message: 'Projeto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover projeto' });
  }
});

// Company
app.get('/api/company', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'companyView');
    if (!access) return;

    const company = await Company.findOne({ userId: access.ownerId });
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar dados da empresa' });
  }
});

app.post('/api/company', authenticateToken, async (req, res) => {
  try {
    const access = await requireAccess(req, res, 'companyEdit');
    if (!access) return;

    const company = await Company.findOneAndUpdate(
      { userId: access.ownerId },
      { ...req.body, userId: access.ownerId },
      { upsert: true, new: true }
    );
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao salvar dados da empresa' });
  }
});

// Iniciar servidor
const startServer = async () => {
  try {
    // Executar script de criação do usuário Lengruber antes de subir o servidor
    const { createLengruber } = require('./create-lengruber.cjs');
    await createLengruber();
    
    // Verificar se o banco está vazio e popular se necessário
    const Workspace = mongoose.model('Workspace');
    const workspaceCount = await Workspace.countDocuments();
    if (workspaceCount === 0) {
      console.log('Banco de dados parece estar vazio. Iniciando seed automático...');
      const { runSeed } = require('./seed-db-module.cjs'); // Vou criar este wrapper
      await runSeed();
    }
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao iniciar servidor:', error);
    // Se falhar o seed, ainda tentamos subir o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} (sem seed)`);
    });
  }
};

startServer();
