import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calendar, 
  User, 
  Heart, 
  Share2, 
  MessageCircle, 
  PenTool,
  Upload,
  X,
  Send,
  Facebook,
  Instagram,
  Twitter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import AdSenseAd from '@/components/AdSenseAd';

interface BlogPost {
  id: string;
  title: string;
  body: string;
  created_at: string;
  created_by?: string;
  attachments?: any[];
  social_tags?: string[];
}

interface BlogComment {
  id: string;
  comment: string;
  created_by?: string;
  created_at: string;
  blog_post_id: string;
}

interface BlogLike {
  id: string;
  blog_post_id: string;
  user_id: string;
}

const socialPlatforms = [
  { name: 'Facebook', icon: Facebook, color: 'bg-blue-600' },
  { name: 'Instagram', icon: Instagram, color: 'bg-pink-600' },
  { name: 'Twitter/X', icon: Twitter, color: 'bg-black' },
  { name: 'TikTok', icon: PenTool, color: 'bg-black' },
  { name: 'WhatsApp', icon: MessageCircle, color: 'bg-green-600' },
  { name: 'LinkedIn', icon: User, color: 'bg-blue-700' },
];

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<{ [key: string]: BlogComment[] }>({});
  const [likes, setLikes] = useState<{ [key: string]: BlogLike[] }>({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [newPost, setNewPost] = useState({ title: '', body: '', attachments: [], social_tags: [] as string[] });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    fetchPosts();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsLoggedIn(!!session);
    if (session?.user) {
      setCurrentUser(session.user);
    }
  };

  const fetchPosts = async () => {
    try {
      // Using type assertion to bypass TypeScript errors temporarily
      const { data: postsData, error: postsError } = await (supabase as any)
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      setPosts(postsData || []);

      // Fetch comments and likes for each post
      for (const post of postsData || []) {
        await fetchCommentsForPost(post.id);
        await fetchLikesForPost(post.id);
      }
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

  const fetchCommentsForPost = async (postId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('blog_comments')
        .select('*')
        .eq('blog_post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikesForPost = async (postId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from('blog_likes')
        .select('*')
        .eq('blog_post_id', postId);

      if (error) throw error;
      setLikes(prev => ({ ...prev, [postId]: data || [] }));
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.body.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to create posts",
          variant: "destructive",
        });
        return;
      }

      let attachments = newPost.attachments;

      const { error } = await (supabase as any)
        .from('blog_posts')
        .insert({
          title: newPost.title,
          body: newPost.body,
          attachments,
          social_tags: newPost.social_tags,
          created_by: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      setNewPost({ title: '', body: '', attachments: [], social_tags: [] });
      setSelectedFile(null);
      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please login to like posts",
          variant: "destructive",
        });
        return;
      }

      const existingLike = likes[postId]?.find(like => like.user_id === user.id);
      
      if (existingLike) {
        // Unlike
        const { error } = await (supabase as any)
          .from('blog_likes')
          .delete()
          .eq('id', existingLike.id);

        if (error) throw error;
      } else {
        // Like
        const { error } = await (supabase as any)
          .from('blog_likes')
          .insert({
            blog_post_id: postId,
            user_id: user.id
          });

        if (error) throw error;
      }

      await fetchLikesForPost(postId);
      
      toast({
        title: "Success",
        description: existingLike ? "Post unliked!" : "Post liked!",
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (postId: string) => {
    const commentText = newComment[postId]?.trim();
    if (!commentText) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await (supabase as any)
        .from('blog_comments')
        .insert({
          blog_post_id: postId,
          comment: commentText,
          created_by: user?.id || null // Allow null for visitors
        });

      if (error) throw error;

      setNewComment(prev => ({ ...prev, [postId]: '' }));
      await fetchCommentsForPost(postId);

      toast({
        title: "Success",
        description: "Comment added successfully!",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (post: BlogPost) => {
    try {
      // Import the social media sharing utilities
      const { getSocialMediaSettings, generateSocialShareLinks, openSocialShareLink } = await import('../utils/socialMediaShare');
      
      const settings = await getSocialMediaSettings();
      const shareLinks = generateSocialShareLinks(post, settings);
      
      // If we have social media links configured, show share options
      if (Object.keys(shareLinks).length > 0) {
        // For now, just open the first available share link
        const [platform, url] = Object.entries(shareLinks)[0];
        openSocialShareLink(platform, url);
        
        toast({
          title: "Success",
          description: `Opening ${platform} to share your post!`,
        });
      } else {
        // Fallback to default sharing
        if (navigator.share) {
          await navigator.share({
            title: post.title,
            text: post.body.substring(0, 100) + '...',
            url: window.location.href,
          });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Success",
            description: "Link copied to clipboard!",
          });
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share post",
        variant: "destructive",
      });
    }
  };

  const toggleSocialTag = (platform: string) => {
    setNewPost(prev => ({
      ...prev,
      social_tags: prev.social_tags.includes(platform)
        ? prev.social_tags.filter(tag => tag !== platform)
        : [...prev.social_tags, platform]
    }));
  };

  const getUserLiked = (postId: string) => {
    return likes[postId]?.some(like => like.user_id === currentUser?.id) || false;
  };

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
          <div className="flex items-center justify-center gap-3 mb-4">
            <PenTool className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Our Blog
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            📝 Stay updated with the latest insights, tips, and stories from our community
          </p>
          
          {/* Admin Create Post Button */}
          {isLoggedIn && (
            <div className="mt-8">
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                    <PenTool className="h-5 w-5" />
                    ✨ Create New Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Create New Blog Post
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newPost.title}
                        onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter an engaging post title..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="body">Content *</Label>
                      <Textarea
                        id="body"
                        value={newPost.body}
                        onChange={(e) => setNewPost(prev => ({ ...prev, body: e.target.value }))}
                        placeholder="Write your blog post content..."
                        rows={8}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="attachment">Attachment</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="attachment"
                          type="file"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                          accept="image/*,video/*,.pdf,.doc,.docx"
                        />
                        {selectedFile && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedFile(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <Label>🌐 Social Media Tags</Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Select platforms where this post will be shared
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {socialPlatforms.map((platform) => (
                          <Button
                            key={platform.name}
                            variant={newPost.social_tags.includes(platform.name) ? "default" : "outline"}
                            onClick={() => toggleSocialTag(platform.name)}
                            className="justify-start gap-2"
                          >
                            <platform.icon className="h-4 w-4" />
                            {platform.name}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost}>
                        🚀 Publish Post
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <Card className="text-center p-8">
            <CardContent>
              <PenTool className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">No blog posts yet</h2>
              <p className="text-muted-foreground">Check back later for exciting content!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8 max-w-4xl mx-auto">
            {posts.map((post, index) => (
              <div key={post.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            👨‍💼 Admin
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            📅 {new Date(post.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Social Tags */}
                      {post.social_tags && post.social_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {post.social_tags.map((tag) => {
                            const platform = socialPlatforms.find(p => p.name === tag);
                            return platform ? (
                              <Badge key={tag} variant="secondary" className="gap-1">
                                <platform.icon className="h-3 w-3" />
                                {tag}
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="prose max-w-none mb-6">
                      <p className="whitespace-pre-wrap leading-relaxed">{post.body}</p>
                    </div>
                    
                    {/* Attachments */}
                    {post.attachments && post.attachments.length > 0 && (
                      <div className="mb-6">
                        {post.attachments.map((attachment: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                            <Upload className="h-4 w-4" />
                            <a 
                              href={attachment.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              📎 {attachment.name}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center gap-4 mb-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLike(post.id)}
                        className="gap-1 hover:bg-red-50 hover:border-red-200"
                      >
                        <Heart className={`h-4 w-4 ${getUserLiked(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
                        {likes[post.id]?.length || 0} {getUserLiked(post.id) ? '❤️' : '🤍'}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(post)}
                        className="gap-1 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <Share2 className="h-4 w-4" />
                        🔗 Share
                      </Button>
                      
                      <span className="text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4 inline mr-1" />
                        💬 {comments[post.id]?.length || 0} comments
                      </span>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    {/* Comments Section */}
                    <div>
                      <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        💬 Comments
                      </h3>
                      
                      {/* Add Comment */}
                      <div className="flex gap-2 mb-4">
                        <Input
                          placeholder="💭 Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                          className="flex-1"
                        />
                        <Button 
                          onClick={() => handleComment(post.id)}
                          disabled={!newComment[post.id]?.trim()}
                          size="sm"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Comments List */}
                      <div className="space-y-3">
                        {comments[post.id]?.map((comment) => (
                          <div key={comment.id} className="bg-muted p-3 rounded-lg">
                            <p className="text-sm mb-2">{comment.comment}</p>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <User className="h-3 w-3" />
                              👤 User • 📅 {new Date(comment.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                        
                        {!comments[post.id]?.length && (
                          <p className="text-muted-foreground text-sm text-center p-4 bg-muted/50 rounded-lg">
                            💭 No comments yet. Be the first to share your thoughts!
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Add ad after every 2 posts */}
                {(index + 1) % 2 === 0 && index < posts.length - 1 && (
                  <AdSenseAd />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;