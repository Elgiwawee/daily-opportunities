import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Heart, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { useTranslation } from 'react-i18next';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  created_at: string;
  image_url?: string;
  tags?: string[];
  likes_count: number;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Use news_items table temporarily since blog_posts doesn't exist yet
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform news_items to match BlogPost interface
      const transformedPosts = (data || []).map((item: any) => ({
        id: item.id,
        title: item.subject,
        content: item.body,
        excerpt: item.body.substring(0, 150) + '...',
        author: 'Admin',
        created_at: item.created_at,
        image_url: null,
        tags: [],
        likes_count: 0
      }));
      
      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to like posts",
          variant: "destructive",
        });
        return;
      }

      // For now, just increment locally until we have proper blog_posts table
      console.log('Like functionality coming soon');

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes_count: post.likes_count + 1 }
          : post
      ));

      toast({
        title: "Success",
        description: "Post liked!",
      });
    } catch (error) {
      console.error('Error liking post:', error);
      toast({
        title: "Error",
        description: "Failed to like post",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (post: BlogPost) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href + `/${post.id}`,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href + `/${post.id}`);
        toast({
          title: "Success",
          description: "Link copied to clipboard!",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const GoogleAdCard = ({ slot, style = {} }: { slot: string; style?: React.CSSProperties }) => (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-1418673216471192"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );

  useEffect(() => {
    // Initialize AdSense ads
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [posts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {t('blog.title', 'Our Blog')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t('blog.subtitle', 'Stay updated with the latest opportunities, tips, and insights')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Top Banner Ad */}
        <GoogleAdCard slot="1234567890" style={{ width: '100%', height: '90px' }} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {posts.length === 0 ? (
              <Card className="text-center p-8">
                <CardContent>
                  <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
                  <p className="text-muted-foreground">Check back later for exciting content!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {posts.map((post, index) => (
                  <div key={post.id}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                      {post.image_url && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags?.map((tag, idx) => (
                            <Badge key={idx} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <CardTitle className="text-2xl hover:text-primary transition-colors cursor-pointer">
                          {post.title}
                        </CardTitle>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleLike(post.id)}
                              className="gap-1"
                            >
                              <Heart className="h-4 w-4" />
                              {post.likes_count}
                            </Button>
                            
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleShare(post)}
                              className="gap-1"
                            >
                              <Share2 className="h-4 w-4" />
                              Share
                            </Button>
                          </div>
                          
                          <Button variant="default">
                            Read More
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* In-content Ad every 3 posts */}
                    {(index + 1) % 3 === 0 && index < posts.length - 1 && (
                      <GoogleAdCard slot="9876543210" style={{ width: '100%', height: '250px' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Sidebar Ad */}
              <GoogleAdCard slot="1357924680" style={{ width: '300px', height: '600px' }} />
              
              <Card>
                <CardHeader>
                  <CardTitle>Latest Updates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Stay tuned for more exciting content and opportunities!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <GoogleAdCard slot="2468135790" style={{ width: '100%', height: '90px' }} />
      </div>
    </div>
  );
};

export default Blog;