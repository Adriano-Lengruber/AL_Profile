import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, Search, 
  Calendar, User, LogIn, LogOut, Send, Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const blogPatterns = [
  { from: 'from-cyber-gold/10', to: 'to-cyber-amber/5', accent: 'text-cyber-gold' },
  { from: 'from-cyber-steel/10', to: 'to-cyber-blue/5', accent: 'text-cyber-steel' },
  { from: 'from-cyber-emerald/10', to: 'to-teal-900/20', accent: 'text-cyber-emerald' },
  { from: 'from-primary/8', to: 'to-cyber-steel/5', accent: 'text-primary/70' },
];

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: { _id: string; username: string; avatar: string };
  authorName: string;
  authorAvatar: string;
  tags: string[];
  likes: string[];
  likesCount: number;
  commentsCount: number;
  readTime: string;
  createdAt: string;
}

export default function BlogPage() {
  const { user, token, login, register, logout, isAuthenticated, loading: authLoading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authLoadingBtn, setAuthLoadingBtn] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [postingComment, setPostingComment] = useState(false);

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts || []);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

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
      }
    } catch (error) {
      console.error('Erro ao dar like:', error);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoadingBtn(true);

    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register(authForm.username, authForm.email, authForm.password);
      }
      setShowAuthModal(false);
      setAuthForm({ username: '', email: '', password: '' });
    } catch (error: any) {
      setAuthError(error.message);
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
      }
    } catch (error) {
      console.error('Erro ao postar comentário:', error);
    } finally {
      setPostingComment(false);
    }
  };

  const isPostLiked = (post: Post) => {
    if (!user || !post.likes) return false;
    return post.likes.includes(user.id);
  };

  if (loading) {
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
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
            <ArrowLeft size={18} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Voltar ao portfólio</span>
            <span className="sm:hidden font-medium">Portfólio</span>
          </Link>
          
          {authLoading ? (
            <Loader2 className="animate-spin text-muted-foreground" size={20} />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block">{user?.username}</span>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 md:px-4 py-2 glass rounded-lg hover:border-primary/30 transition-colors"
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
      </header>

      {/* Post Detail Modal */}
      {selectedPost && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setSelectedPost(null)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-8">
              <button 
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-white"
              >
                <LogOut size={24} className="rotate-180" />
              </button>
              
              <div className="flex gap-2 mb-4">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary/70">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="font-heading text-3xl font-bold mb-4">{selectedPost.title}</h1>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-2">
                  <User size={16} /> {selectedPost.authorName}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> {new Date(selectedPost.createdAt).toLocaleDateString('pt-BR')}
                </span>
                <span>{selectedPost.readTime} leitura</span>
              </div>
              
              <div className="prose prose-invert max-w-none mb-8">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedPost.content}
                </p>
              </div>
              
              {/* Comments Section */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="font-semibold text-lg mb-4">
                  Comentários ({selectedPost.commentsCount})
                </h3>
                
                {isAuthenticated && (
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
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 glass rounded-xl border border-white/10 focus:border-primary/50 focus:outline-none transition-colors"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedTag(null)}
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
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
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
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">Nenhum post publicado ainda.</p>
            {isAuthenticated && (
              <p className="text-primary">Seja o primeiro a criar um post!</p>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => {
              const pattern = blogPatterns[index % blogPatterns.length];
              return (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-300 group cursor-pointer"
                  onClick={() => handleViewPost(post)}
                >
                  <div className={`h-32 bg-gradient-to-br ${pattern.from} ${pattern.to} flex items-center justify-center`}>
                    <span className={`${pattern.accent} font-heading text-4xl font-bold opacity-50`}>
                      {post.title.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary/70">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <h2 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} /> {post.authorName}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-3">
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
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        {filteredPosts.length === 0 && posts.length > 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum post encontrado com os filtros selecionados.</p>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-8 max-w-md w-full"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-heading text-2xl font-bold mb-6 text-center">
              {authMode === 'login' ? 'Entrar na Comunidade' : 'Criar Conta'}
            </h2>
            
            {authError && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {authError}
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
                    className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Senha</label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                  required
                  minLength={6}
                />
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
                  setAuthError('');
                }}
                className="text-primary hover:underline"
              >
                {authMode === 'login' ? 'Criar conta' : 'Entrar'}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="py-8 border-t border-white/6 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-muted-foreground text-sm">
          <p>© {new Date().getFullYear()} Adriano Lengruber. Feito com precisão e tecnologia.</p>
        </div>
      </footer>
    </div>
  );
}
