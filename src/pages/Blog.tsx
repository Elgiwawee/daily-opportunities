import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BlogPostForm } from '@/components/BlogPostForm';
import Navbar from '@/components/Navbar';
import { Plus, Heart, MessageCircle, Share2, User, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface BlogPost {
  id: string;
  title: string;
  body: string;
  attachments: any;
  social_tags: any;
  created_at: string;
  created_by: string | null;
  likes_count: number;
  comments_count: number;
  user_liked: boolean;
}

const Blog = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUser();
    fetchBlogPosts();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchBlogPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          blog_likes!inner(count),
          blog_comments!inner(count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get like counts and user likes for each post
      const postsWithCounts = await Promise.all(
        (posts || []).map(async (post) => {
          const { count: likesCount } = await supabase
            .from('blog_likes')
            .select('*', { count: 'exact', head: true })
            .eq('blog_post_id', post.id);

          const { count: commentsCount } = await supabase
            .from('blog_comments')
            .select('*', { count: 'exact', head: true })
            .eq('blog_post_id', post.id);

          let userLiked = false;
          if (user) {
            const { data: likeData } = await supabase
              .from('blog_likes')
              .select('id')
              .eq('blog_post_id', post.id)
              .eq('user_id', user.id)
              .maybeSingle();
            userLiked = !!likeData;
          }

          return {
            ...post,
            likes_count: likesCount || 0,
            comments_count: commentsCount || 0,
            user_liked: userLiked,
          };
        })
      );

      setBlogPosts(postsWithCounts);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: "Error",
        description: "Failed to load blog posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const post = blogPosts.find(p => p.id === postId);
      if (!post) return;

      if (post.user_liked) {
        // Unlike
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('blog_likes')
          .insert({ blog_post_id: postId, user_id: user.id });
      }

      // Update local state
      setBlogPosts(posts =>
        posts.map(p =>
          p.id === postId
            ? {
                ...p,
                user_liked: !p.user_liked,
                likes_count: p.user_liked ? p.likes_count - 1 : p.likes_count + 1,
              }
            : p
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (post: BlogPost) => {
    const shareData = {
      title: post.title,
      text: post.body.substring(0, 100) + '...',
      url: `${window.location.origin}/blog/${post.id}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link copied!",
        description: "Blog post link copied to clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navbar />
      <div className="pt-20"> {/* Added padding to account for fixed navbar */}
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-glow text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <Link 
                to="/" 
                className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
              
              <div className="text-center">
                <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                  {t('Blog & Insights')}
                </h1>
            <p className="text-xl opacity-90 mb-8 animate-fade-in animation-delay-200">
              Discover trending topics, share your thoughts, and connect with our community
            </p>
            {user && (
              <Button
                onClick={() => setShowForm(true)}
                size="lg"
                variant="secondary"
                className="animate-fade-in animation-delay-400 hover-scale"
              >
                <Plus className="mr-2 h-5 w-5" />
                  Create Post
                </Button>
              )}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
        {/* Blog Post Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <BlogPostForm
                onSuccess={() => {
                  setShowForm(false);
                  fetchBlogPosts();
                }}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="max-w-6xl mx-auto">
          {blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-32 h-32 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                <MessageCircle className="h-16 w-16 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">No blog posts yet</h3>
              <p className="text-muted-foreground mb-8">Be the first to share your thoughts with the community!</p>
              {user && (
                <Button onClick={() => setShowForm(true)} size="lg">
                  <Plus className="mr-2 h-5 w-5" />
                  Create First Post
                </Button>
              )}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post, index) => (
                <Card 
                  key={post.id} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-card/50 backdrop-blur-sm animate-fade-in hover-scale"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground line-clamp-3">
                      {post.body}
                    </p>
                    
                    {/* Social Tags */}
                    {post.social_tags && post.social_tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {post.social_tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag.platform}: @{tag.handle}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`hover-scale ${post.user_liked ? 'text-red-500' : ''}`}
                        >
                          <Heart className={`h-4 w-4 mr-1 ${post.user_liked ? 'fill-current' : ''}`} />
                          {post.likes_count}
                        </Button>
                        
                        <Link
                          to={`/blog/${post.id}`}
                          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {post.comments_count}
                        </Link>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(post)}
                          className="hover-scale"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        
                        <Link to={`/blog/${post.id}`}>
                          <Button variant="ghost" size="sm" className="hover-scale">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;