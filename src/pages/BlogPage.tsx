import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Heart, MessageCircle, Share2, Search, 
  Calendar, User, LogIn
} from 'lucide-react';
import { blogPosts } from '../App';

const blogPatterns = [
  { from: 'from-cyber-gold/10', to: 'to-cyber-amber/5', accent: 'text-cyber-gold' },
  { from: 'from-cyber-steel/10', to: 'to-cyber-blue/5', accent: 'text-cyber-steel' },
  { from: 'from-cyber-emerald/10', to: 'to-teal-900/20', accent: 'text-cyber-emerald' },
  { from: 'from-primary/8', to: 'to-cyber-steel/5', accent: 'text-primary/70' },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleLike = (id: number) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-cyber-black">
      {/* Header */}
      <header className="glass border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded px-1 -ml-1">
            <ArrowLeft size={18} className="md:w-5 md:h-5" />
            <span className="hidden sm:inline">Voltar ao portfólio</span>
            <span className="sm:hidden font-medium">Portfólio</span>
          </Link>
          <button 
            onClick={() => setShowAuthModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 glass rounded-lg hover:border-primary/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <LogIn size={16} className="md:w-[18px] md:h-[18px]" />
            <span className="hidden sm:inline">Entrar</span>
          </button>
        </nav>
      </header>

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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post, index) => {
            const pattern = blogPatterns[index % blogPatterns.length];
            return (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-xl overflow-hidden hover:border-primary/25 transition-all duration-300 group"
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
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={12} /> {post.author}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1 text-sm transition-colors ${
                          likedPosts.includes(post.id) 
                            ? 'text-red-500' 
                            : 'text-muted-foreground hover:text-red-500'
                        }`}
                      >
                        <Heart size={16} fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} />
                        {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MessageCircle size={16} />
                        {post.comments}
                      </span>
                    </div>
                    <button className="text-muted-foreground hover:text-primary transition-colors">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        {filteredPosts.length === 0 && (
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
              Junte-se à Comunidade
            </h2>
            <p className="text-muted-foreground text-center mb-6">
              Entre com sua conta para curtir, comentar e compartilhar posts.
            </p>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                <LogIn size={18} />
                Entrar com Email
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-6 py-3 glass rounded-lg font-medium hover:border-primary/30 transition-colors">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-6">
              Não tem conta?{' '}
              <button className="text-primary hover:underline">
                Criar conta
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
