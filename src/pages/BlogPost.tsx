import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, Heart, MessageCircle, Share2, User, Calendar, Send, Facebook, Twitter, Instagram, MessageSquare, Hash } from 'lucide-react';
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
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  created_by: string | null;
}

const socialPlatformIcons = {
  Facebook: <Facebook className="h-4 w-4" />,
  Twitter: <Twitter className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <Hash className="h-4 w-4" />,
  WhatsApp: <MessageSquare className="h-4 w-4" />,
};

const socialPlatformColors = {
  Facebook: 'bg-blue-600',
  Twitter: 'bg-sky-500',
  Instagram: 'bg-pink-600',
  TikTok: 'bg-black',
  WhatsApp: 'bg-green-600',
};

const BlogPost = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [likesCount, setLikesCount] = useState(0);
  const [userLiked, setUserLiked] = useState(false);

  useEffect(() => {
    fetchUser();
    if (id) {
      fetchBlogPost();
      fetchComments();
      fetchLikes();
    }
  }, [id]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchBlogPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching blog post:', error);
      toast({
        title: "Error",
        description: "Failed to load blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .select('*')
        .eq('blog_post_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const { count } = await supabase
        .from('blog_likes')
        .select('*', { count: 'exact', head: true })
        .eq('blog_post_id', id);

      setLikesCount(count || 0);

      if (user) {
        const { data } = await supabase
          .from('blog_likes')
          .select('id')
          .eq('blog_post_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        setUserLiked(!!data);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like posts",
        variant: "destructive",
      });
      return;
    }

    try {
      if (userLiked) {
        await supabase
          .from('blog_likes')
          .delete()
          .eq('blog_post_id', id)
          .eq('user_id', user.id);
        
        setLikesCount(prev => prev - 1);
        setUserLiked(false);
      } else {
        await supabase
          .from('blog_likes')
          .insert({ blog_post_id: id, user_id: user.id });
        
        setLikesCount(prev => prev + 1);
        setUserLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_comments')
        .insert({
          blog_post_id: id,
          comment: newComment.trim(),
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setComments(prev => [...prev, data]);
      setNewComment('');
      
      toast({
        title: "Success!",
        description: "Comment added successfully",
      });
    } catch (error: any) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = async () => {
    if (!post) return;

    const shareData = {
      title: post.title,
      text: post.body.substring(0, 100) + '...',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
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

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Blog post not found</h2>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back Button */}
        <Link to="/blog" className="inline-flex mb-8">
          <Button variant="ghost" className="hover-scale">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Blog Post */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            <CardTitle className="text-3xl font-bold leading-tight">
              {post.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                {post.body}
              </p>
            </div>

            {/* Attachments */}
            {post.attachments && post.attachments.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-semibold">Attachments</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {post.attachments.map((attachment: string, index: number) => (
                    <div key={index} className="relative overflow-hidden rounded-lg bg-muted">
                      {attachment.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img 
                          src={attachment} 
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="p-4 text-center">
                          <p className="text-sm text-muted-foreground">Attachment {index + 1}</p>
                          <a 
                            href={attachment} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            View File
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social Tags */}
            {post.social_tags && post.social_tags.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">Social Media Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {post.social_tags.map((tag: any, index: number) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-2">
                      <div className={`p-1 rounded-full text-white ${socialPlatformColors[tag.platform as keyof typeof socialPlatformColors]}`}>
                        {socialPlatformIcons[tag.platform as keyof typeof socialPlatformIcons]}
                      </div>
                      {tag.platform}: @{tag.handle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-6 border-t">
              <Button
                variant="ghost"
                onClick={handleLike}
                className={`hover-scale ${userLiked ? 'text-red-500' : ''}`}
              >
                <Heart className={`h-5 w-5 mr-2 ${userLiked ? 'fill-current' : ''}`} />
                {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
              </Button>
              
              <Button variant="ghost" className="hover-scale">
                <MessageCircle className="h-5 w-5 mr-2" />
                {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
              </Button>
              
              <Button variant="ghost" onClick={handleShare} className="hover-scale">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="animate-fade-in animation-delay-200">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="mr-2 h-5 w-5" />
              Comments ({comments.length})
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="space-y-4">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="min-h-[100px] resize-none"
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={commentLoading || !newComment.trim()}
                    className="hover-scale"
                  >
                    {commentLoading ? 'Posting...' : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 bg-muted/50 rounded-lg">
                <p className="text-muted-foreground mb-4">Please sign in to comment</p>
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment, index) => (
                  <div 
                    key={comment.id} 
                    className="flex space-x-3 p-4 bg-muted/30 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                      </div>
                      <p className="text-foreground whitespace-pre-wrap">
                        {comment.comment}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogPost;