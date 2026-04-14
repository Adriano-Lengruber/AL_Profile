import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, Search, 
  Calendar, User, LogIn, LogOut, Send, Loader2,
  Plus, Edit2, Trash2, X, ChevronLeft, ChevronRight,
  Settings, Image, Tag, Clock, BarChart3
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import brandLogo from '../../Imgs/Logos_Formacoes/LOGO01.png';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const blogPatterns = [
  { from: 'from-cyber-gold/10', to: 'to-cyber-amber/5', accent: 'text-cyber-gold', gradient: 'bg-gradient-to-br from-amber-900/30 via-yellow-900/20 to-orange-900/30' },
  { from: 'from-cyber-steel/10', to: 'to-cyber-blue/5', accent: 'text-cyber-steel', gradient: 'bg-gradient-to-br from-slate-800/40 via-blue-900/20 to-cyan-900/30' },
  { from: 'from-cyber-emerald/10', to: 'to-teal-900/20', accent: 'text-cyber-emerald', gradient: 'bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30' },
  { from: 'from-primary/8', to: 'to-cyber-steel/5', accent: 'text-primary/70', gradient: 'bg-gradient-to-br from-purple-900/30 via-primary/20 to-blue-900/30' },
  { from: 'from-rose-900/20', to: 'to-pink-900/20', accent: 'text-rose-400', gradient: 'bg-gradient-to-br from-rose-900/40 via-red-900/20 to-pink-900/30' },
  { from: 'from-violet-900/20', to: 'to-indigo-900/20', accent: 'text-violet-400', gradient: 'bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-indigo-900/30' },
];

interface Post {
  id: string;
  _id?: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: { _id: string; username: string; avatar: string };
  authorName: string;
  authorAvatar: string;
  tags: string[];
  likes: string[];
  likesCount: number;
  commentsCount: number;
  readTime: string;
  createdAt: string;
  liked?: boolean;
}

// Tag colors mapping
const tagColors: { [key: string]: { bg: string; text: string; border: string } } = {
  'Machine Learning': { bg: 'from-purple-600/20 to-pink-600/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Python': { bg: 'from-yellow-600/20 to-green-600/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  'Data Science': { bg: 'from-blue-600/20 to-cyan-600/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'ETL': { bg: 'from-orange-600/20 to-red-600/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  'Data Engineering': { bg: 'from-emerald-600/20 to-teal-600/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Power BI': { bg: 'from-yellow-600/20 to-orange-600/20', text: 'text-yellow-300', border: 'border-yellow-500/30' },
  'DAX': { bg: 'from-red-600/20 to-pink-600/20', text: 'text-red-400', border: 'border-red-500/30' },
  'Business Intelligence': { bg: 'from-indigo-600/20 to-purple-600/20', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'Automação': { bg: 'from-cyan-600/20 to-blue-600/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
  'n8n': { bg: 'from-teal-600/20 to-emerald-600/20', text: 'text-teal-400', border: 'border-teal-500/30' },
  'Productivity': { bg: 'from-rose-600/20 to-pink-600/20', text: 'text-rose-400', border: 'border-rose-500/30' },
};

const getTagColor = (tag: string) => {
  return tagColors[tag] || { bg: 'from-primary/20 to-primary/10', text: 'text-primary', border: 'border-primary/30' };
};

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function BlogPage() {
  const { user, token, login, register, logout, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authErrors, setAuthErrors] = useState<{ [key: string]: string }>({});
  const [authLoadingBtn, setAuthLoadingBtn] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState({ title: '', excerpt: '', content: '', tags: '', readTime: '5 min', imageUrl: '' });
  const [postErrors, setPostErrors] = useState<{ [key: string]: string }>({});
  const [postSubmitting, setPostSubmitting] = useState(false);
  const [deletingPost, setDeletingPost] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({ avatar: '', bio: '' });
  const [profileErrors, setProfileErrors] = useState<{ [key: string]: string }>({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  // Fetch posts with pagination
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (pagination?.page) params.append('page', pagination.page.toString());
        if (params.toString()) {
          params.append('limit', '9');
        } else {
          params.append('limit', '9');
        }
        
        const res = await fetch(`${API_URL}/posts?${params}`);
        const data = await res.json();
        if (res.ok) {
          // Add liked property based on current user
          const postsWithLiked = (data.posts || []).map((post: Post) => ({
            ...post,
            liked: token ? post.likes?.includes(user?.id || '') : false
          }));
          setPosts(postsWithLiked);
          setPagination(data.pagination);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [pagination?.page, token, user?.id]);

  // Check for post ID in URL query and open post modal
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postId = params.get('id');
    if (postId && posts.length > 0) {
      const post = posts.find(p => p._id === postId || p.id === postId);
      if (post) {
        setSelectedPost(post);
      }
    }
  }, [posts]);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts locally for search
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Debounced search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPagination(prev => prev ? { ...prev, page: 1 } : null);
    }, 500);
  };

  const handleLike = async (postId: string) => {
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likesCount: data.likesCount, liked: data.liked }
            : post
        ));
        if (selectedPost?.id === postId) {
          setSelectedPost(prev => prev ? { ...prev, likesCount: data.likesCount, liked: data.liked } : null);
        }
      }
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  // Validation functions
  const validateAuthForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (authMode === 'register') {
      if (!authForm.username.trim()) {
        errors.username = 'Nome de usuário é obrigatório';
      } else if (authForm.username.length < 3) {
        errors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
      } else if (!/^[a-zA-Z0-9_]+$/.test(authForm.username)) {
        errors.username = 'Nome de usuário pode conter apenas letras, números e underscore';
      }
    }
    
    if (!authForm.email.trim()) {
      errors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authForm.email)) {
      errors.email = 'Email inválido';
    }
    
    if (!authForm.password) {
      errors.password = 'Senha é obrigatória';
    } else if (authForm.password.length < 6) {
      errors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setAuthErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePostForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!postForm.title.trim()) {
      errors.title = 'Título é obrigatório';
    } else if (postForm.title.length < 5) {
      errors.title = 'Título deve ter pelo menos 5 caracteres';
    }
    
    if (!postForm.excerpt.trim()) {
      errors.excerpt = 'Resumo é obrigatório';
    } else if (postForm.excerpt.length < 20) {
      errors.excerpt = 'Resumo deve ter pelo menos 20 caracteres';
    }
    
    if (!postForm.content.trim()) {
      errors.content = 'Conteúdo é obrigatório';
    } else if (postForm.content.length < 50) {
      errors.content = 'Conteúdo deve ter pelo menos 50 caracteres';
    }

    setPostErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAuthForm()) return;
    
    setAuthLoadingBtn(true);

    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.username, authForm.email, authForm.password);
      }
      setShowAuthModal(false);
      setAuthForm({ username: '', email: '', password: '' });
      setAuthErrors({});
    } catch (error: any) {
      setAuthErrors({ form: error.message });
    } finally {
      setAuthLoadingBtn(false);
    }
  };

  const loadComments = async (postId: string) => {
    setLoadingComments(true);
    try {
      const res = await fetch(`${API_URL}/posts/${postId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleViewPost = (post: Post) => {
    setSelectedPost(post);
    loadComments(post.id);
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newComment.trim()) return;

    setPostingComment(true);
    try {
      const res = await fetch(`${API_URL}/posts/${selectedPost?.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: newComment })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setNewComment('');
        setPosts(posts.map(p => 
          p.id === selectedPost?.id 
            ? { ...p, commentsCount: p.commentsCount + 1 }
            : p
        ));
        setSelectedPost(prev => prev ? { ...prev, commentsCount: prev.commentsCount + 1 } : null);
      }
    } catch (error) {
      console.error('Erro ao postar comentário:', error);
    } finally {
      setPostingComment(false);
    }
  };

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePostForm() || !token) return;

    setPostSubmitting(true);
    try {
      const postData = {
        title: postForm.title,
        excerpt: postForm.excerpt,
        content: postForm.content,
        tags: postForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        readTime: postForm.readTime,
        imageUrl: postForm.imageUrl
      };

      const url = editingPost ? `${API_URL}/posts/${editingPost.id}` : `${API_URL}/posts`;
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(postData)
      });

      if (res.ok) {
        const savedPost = await res.json();
        if (editingPost) {
          setPosts(posts.map(p => p.id === editingPost.id ? { ...savedPost, liked: p.liked } : p));
        } else {
          setPosts([{ ...savedPost, liked: false }, ...posts]);
        }
        setShowPostModal(false);
        setEditingPost(null);
        setPostForm({ title: '', excerpt: '', content: '', tags: '', readTime: '5 min', imageUrl: '' });
        setPostErrors({});
      }
    } catch (error) {
      console.error('Erro ao salvar post:', error);
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    
    setDeletingPost(postId);
    try {
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setPosts(posts.filter(p => p.id !== postId));
        if (selectedPost?.id === postId) {
          setSelectedPost(null);
        }
      }
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    } finally {
      setDeletingPost(null);
    }
  };

  const openEditPost = (post: Post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      tags: post.tags.join(', '),
      readTime: post.readTime,
      imageUrl: post.imageUrl || ''
    });
    setShowPostModal(true);
  };

  const validateProfileForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (profileForm.bio.length > 200) {
      errors.bio = 'Bio deve ter no máximo 200 caracteres';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateProfileForm() || !token) return;

    setProfileSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          avatar: profileForm.avatar,
          bio: profileForm.bio
        })
      });

      if (res.ok) {
        const updatedUser = await res.json();
        updateUser(updatedUser);
        setShowProfileModal(false);
        setProfileErrors({});
      }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setProfileSubmitting(false);
    }
  };

  const openProfileModal = () => {
    setProfileForm({
      avatar: user?.avatar || '',
      bio: user?.bio || ''
    });
    setShowProfileModal(true);
  };

  const isPostLiked = (post: Post) => {
    if (!user || !post.likes) return false;
    return post.liked || post.likes.includes(user.id);
  };

  const changePage = (newPage: number) => {
    if (pagination && newPage >= 1 && newPage <= pagination.pages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-cyber-black flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="animate-spin" size={24} />
          Carregando posts...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-primary hover:text-primary/80 transition-colors">
            <img
              src={brandLogo}
              alt="Adriano Lengruber"
              className="h-9 w-auto shrink-0 md:h-10"
              loading="eager"
              decoding="async"
            />
            <span className="inline-flex items-center gap-2">
              <ArrowLeft size={18} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">Voltar ao portfólio</span>
              <span className="sm:hidden font-medium">Portfólio</span>
            </span>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <Settings size={20} />
          </button>

          {authLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={20} />
          ) : isAuthenticated ? (
            <div className="hidden md:flex items-center gap-3">
              {user?.avatar && (
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover border border-primary/30"
                />
              )}
              <span className="text-sm text-muted-foreground">{user?.username}</span>
              <button 
                onClick={() => setShowPostModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Novo Post</span>
              </button>
              <button 
                onClick={openProfileModal}
                className="flex items-center gap-2 px-3 py-2 glass rounded-lg hover:border-primary/30 transition-colors"
              >
                <Settings size={16} />
              </button>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 glass rounded-lg hover:border-primary/30 transition-colors"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 glass rounded-lg hover:border-primary/30 transition-colors"
            >
              <LogIn size={16} className="md:w-[18px] md:h-[18px]" />
              <span className="hidden sm:inline">Entrar</span>
            </button>
          )}
        </nav>

        {/* Mobile Menu */}
        {showMobileMenu && isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/10 p-4 space-y-3"
          >
            <div className="flex items-center gap-3">
              {user?.avatar && (
                <img 
                  src={user.avatar || '/default-avatar.png'} 
                  alt={user.username}
                  className="w-10 h-10 rounded-full object-cover border border-primary/30"
                />
              )}
              <span className="text-sm text-muted-foreground">{user?.username}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => { setShowPostModal(true); setShowMobileMenu(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
              >
                <Plus size={16} /> Novo Post
              </button>
              <button 
                onClick={() => { openProfileModal(); setShowMobileMenu(false); }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg"
              >
                <Settings size={16} /> Perfil
              </button>
              <button 
                onClick={() => { logout(); setShowMobileMenu(false); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 glass rounded-lg"
              >
                <LogOut size={16} /> Sair
              </button>
            </div>
          </motion.div>
        )}
      </header>

      {/* Post Detail Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-lg transition-colors z-10"
              >
                <X size={24} />
              </button>
              
              {/* Author actions */}
              {isAuthenticated && user?.id === selectedPost.author?._id && (
                <div className="absolute top-4 left-4 flex gap-2 z-10">
                  <button 
                    onClick={() => { setSelectedPost(null); openEditPost(selectedPost); }}
                    className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeletePost(selectedPost.id)}
                    disabled={deletingPost === selectedPost.id}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
                  >
                    {deletingPost === selectedPost.id ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              )}
              
              <div className="p-8 pt-16">
                <div className="flex gap-2 mb-4 flex-wrap">
                  {selectedPost.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1.5 rounded-full bg-primary/15 text-primary/80 border border-primary/25 font-medium flex items-center gap-1.5">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
                
                <h1 className="font-heading text-3xl font-bold mb-4">{selectedPost.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                  <div className="flex items-center gap-2">
                    {selectedPost.authorAvatar ? (
                      <img src={selectedPost.authorAvatar} alt={selectedPost.authorName} className="w-6 h-6 rounded-full" />
                    ) : (
                      <User size={16} />
                    )}
                    <span>{selectedPost.authorName}</span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(selectedPost.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {selectedPost.readTime} leitura
                  </span>
                </div>
                
                <div className="prose prose-invert max-w-none mb-8">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {selectedPost.content}
                  </p>
                </div>
                
                {/* Like button */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
                  <button 
                    onClick={() => handleLike(selectedPost.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isPostLiked(selectedPost) 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'glass hover:border-red-500/30'
                    }`}
                  >
                    <Heart size={20} fill={isPostLiked(selectedPost) ? 'currentColor' : 'none'} />
                    <span>{selectedPost.likesCount || 0}</span>
                  </button>
                </div>
                
                {/* Comments Section */}
                <div className="border-t border-white/10 pt-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Comentários ({selectedPost.commentsCount})
                  </h3>
                  
                  {isAuthenticated ? (
                    <form onSubmit={handleSubmitComment} className="mb-6">
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Escreva um comentário..."
                          className="flex-1 px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                        />
                        <button 
                          type="submit" 
                          disabled={postingComment || !newComment.trim()}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          {postingComment ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-muted-foreground text-sm mb-4">
                      <button onClick={() => setShowAuthModal(true)} className="text-primary hover:underline">Entre</button> para comentar
                    </p>
                  )}
                  
                  {loadingComments ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin text-muted-foreground" size={24} />
                    </div>
                  ) : comments.length > 0 ? (
                    <div className="space-y-4">
                      {comments.map((comment: any) => (
                        <div key={comment._id} className="glass rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            {comment.authorAvatar ? (
                              <img src={comment.authorAvatar} alt={comment.authorName} className="w-6 h-6 rounded-full" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <User size={12} />
                              </div>
                            )}
                            <span className="font-medium text-sm">{comment.authorName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          <p className="text-muted-foreground text-sm">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Nenhum comentário ainda. Seja o primeiro!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-heading text-5xl font-bold mb-4">
            Blog <span className="text-gradient">Comunitário</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Compartilhando conhecimento sobre dados, IA e tecnologia. 
            Junte-se à comunidade!
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 space-y-4"
        >
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Buscar artigos..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => { setSelectedTag(null); setPagination(prev => prev ? { ...prev, page: 1 } : null); }}
              className={`px-4 py-2 rounded-full text-sm transition-all ${
                !selectedTag 
                  ? 'bg-primary text-primary-foreground' 
                  : 'glass hover:border-primary/30'
              }`}
            >
              Todos
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => { setSelectedTag(tag === selectedTag ? null : tag); setPagination(prev => prev ? { ...prev, page: 1 } : null); }}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  selectedTag === tag 
                    ? 'bg-primary text-primary-foreground' 
                    : 'glass hover:border-primary/30'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Nenhum post encontrado.</p>
            {isAuthenticated && (
              <button 
                onClick={() => setShowPostModal(true)}
                className="text-primary hover:underline"
              >
                Criar o primeiro post!
              </button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const pattern = blogPatterns[index % blogPatterns.length];
              const isOwner = isAuthenticated && user?.id === post.author?._id;
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleViewPost(post)}
                >
                  {/* Image area - standardized to landing page format */}
                  <div className={`h-44 bg-gradient-to-br ${pattern.from} ${pattern.to} relative overflow-hidden blog-pattern`}>
                    {post.imageUrl ? (
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`flex flex-col items-center gap-2 opacity-30 ${pattern.accent}`}>
                          <BarChart3 size={48} strokeWidth={1} />
                        </div>
                      </div>
                    )}
                    {/* Gold badges on image */}
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2.5 py-1 rounded glass text-xs font-medium backdrop-blur-md text-primary">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {/* Edit button for owner */}
                    {isOwner && (
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); openEditPost(post); }}
                          className="p-1.5 bg-black/50 backdrop-blur-sm rounded-lg hover:bg-black/70 transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h2 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    {/* Date, read time and author */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {post.readTime}
                      </span>
                    </div>
                    <div className="text-xs text-primary/80 mb-3">
                      {post.authorName || 'Autor'}
                    </div>
                    
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLike(post.id);
                        }}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          isPostLiked(post) 
                            ? 'text-red-500' 
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} fill={isPostLiked(post) ? 'currentColor' : 'none'} />
                        {post.likesCount || 0}
                      </button>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle size={16} />
                        {post.commentsCount || 0}
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 mt-12"
          >
            <button
              onClick={() => changePage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 glass rounded-lg hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-muted-foreground px-4">
              {pagination.page} / {pagination.pages}
            </span>
            <button
              onClick={() => changePage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 glass rounded-lg hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </main>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAuthModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                {authMode === 'login' ? 'Entrar na Comunidade' : 'Criar Conta'}
              </h2>
              
              {authErrors.form && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {authErrors.form}
                </div>
              )}
              
              <form onSubmit={handleAuth} className="space-y-4">
                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Nome de usuário</label>
                    <input
                      type="text"
                      value={authForm.username}
                      onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })}
                      className={`w-full px-4 py-2 glass rounded-lg border ${authErrors.username ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none`}
                      placeholder="seu_usuario"
                    />
                    {authErrors.username && (
                      <p className="text-red-400 text-xs mt-1">{authErrors.username}</p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Email</label>
                  <input
                    type="email"
                    value={authForm.email}
                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${authErrors.email ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none`}
                    placeholder="seu@email.com"
                  />
                  {authErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{authErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Senha</label>
                  <input
                    type="password"
                    value={authForm.password}
                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${authErrors.password ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none`}
                    placeholder="••••••••"
                  />
                  {authErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{authErrors.password}</p>
                  )}
                </div>
                
                <button 
                  type="submit" 
                  disabled={authLoadingBtn}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {authLoadingBtn ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <LogIn size={18} />
                      {authMode === 'login' ? 'Entrar' : 'Criar Conta'}
                    </>
                  )}
                </button>
              </form>
              
              <p className="text-center text-sm text-muted-foreground mt-6">
                {authMode === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}
                <button 
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthErrors({});
                  }}
                  className="text-primary hover:underline"
                >
                  {authMode === 'login' ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto"
            onClick={() => { setShowPostModal(false); setEditingPost(null); }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => { setShowPostModal(false); setEditingPost(null); }}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-heading text-2xl font-bold mb-6">
                {editingPost ? 'Editar Post' : 'Criar Novo Post'}
              </h2>
              
              <form onSubmit={handleSubmitPost} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Título *</label>
                  <input
                    type="text"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${postErrors.title ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none`}
                    placeholder="Título do seu post"
                  />
                  {postErrors.title && (
                    <p className="text-red-400 text-xs mt-1">{postErrors.title}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Resumo *</label>
                  <textarea
                    value={postForm.excerpt}
                    onChange={(e) => setPostForm({ ...postForm, excerpt: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${postErrors.excerpt ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none resize-none`}
                    rows={2}
                    placeholder="Um resumo breve do seu post"
                  />
                  {postErrors.excerpt && (
                    <p className="text-red-400 text-xs mt-1">{postErrors.excerpt}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Conteúdo *</label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${postErrors.content ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none resize-none`}
                    rows={8}
                    placeholder="Escreva o conteúdo do seu post aqui..."
                  />
                  {postErrors.content && (
                    <p className="text-red-400 text-xs mt-1">{postErrors.content}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">URL da Imagem de Capa</label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="url"
                      value={postForm.imageUrl}
                      onChange={(e) => setPostForm({ ...postForm, imageUrl: e.target.value })}
                      className="w-full pl-10 px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Adicione uma URL de imagem para a capa do post</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Tags (separadas por vírgula)</label>
                    <input
                      type="text"
                      value={postForm.tags}
                      onChange={(e) => setPostForm({ ...postForm, tags: e.target.value })}
                      className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="react, typescript, etc"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-1">Tempo de leitura</label>
                    <select
                      value={postForm.readTime}
                      onChange={(e) => setPostForm({ ...postForm, readTime: e.target.value })}
                      className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    >
                      <option value="1 min">1 min</option>
                      <option value="3 min">3 min</option>
                      <option value="5 min">5 min</option>
                      <option value="10 min">10 min</option>
                      <option value="15 min">15 min</option>
                      <option value="20+ min">20+ min</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  disabled={postSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {postSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Send size={18} />
                      {editingPost ? 'Salvar Alterações' : 'Publicar Post'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass rounded-2xl p-8 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h2 className="font-heading text-2xl font-bold mb-6 text-center">
                Editar Perfil
              </h2>
              
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {profileForm.avatar ? (
                    <img 
                      src={profileForm.avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-primary"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary">
                      <User size={40} className="text-primary" />
                    </div>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">URL do Avatar</label>
                  <div className="relative">
                    <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) => setProfileForm({ ...profileForm, avatar: e.target.value })}
                      className="w-full pl-10 px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                      placeholder="https://exemplo.com/avatar.jpg"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">
                    Bio ({profileForm.bio.length}/200)
                  </label>
                  <textarea
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className={`w-full px-4 py-2 glass rounded-lg border ${profileErrors.bio ? 'border-red-500' : 'border-white/10'} focus:border-primary/50 focus:outline-none resize-none`}
                    rows={3}
                    placeholder="Conte um pouco sobre você..."
                  />
                  {profileErrors.bio && (
                    <p className="text-red-400 text-xs mt-1">{profileErrors.bio}</p>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    <span className="text-primary font-medium">Email:</span> {user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="text-primary font-medium">Membro desde:</span> {user && new Date().getFullYear()}
                  </p>
                </div>
                
                <button 
                  type="submit" 
                  disabled={profileSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {profileSubmitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      <Settings size={18} />
                      Salvar Perfil
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-8 border-t border-white/6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm flex flex-col items-center gap-4">
          <img
            src={brandLogo}
            alt="Adriano Lengruber"
            className="h-12 w-auto"
            loading="lazy"
            decoding="async"
          />
          <p>© {new Date().getFullYear()} Adriano Lengruber. Feito com precisão e tecnologia.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
            <Link to="/termos" className="hover:text-primary transition-colors">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
