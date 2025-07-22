import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, Facebook, Twitter, Instagram, MessageSquare, Hash } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SocialTag {
  platform: string;
  handle: string;
}

interface SocialTagWithIcon extends SocialTag {
  icon: React.ReactNode;
}

interface BlogPostFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const socialPlatforms = [
  { name: 'Facebook', icon: <Facebook className="h-4 w-4" />, color: 'bg-blue-600' },
  { name: 'Twitter', icon: <Twitter className="h-4 w-4" />, color: 'bg-sky-500' },
  { name: 'Instagram', icon: <Instagram className="h-4 w-4" />, color: 'bg-pink-600' },
  { name: 'TikTok', icon: <Hash className="h-4 w-4" />, color: 'bg-black' },
  { name: 'WhatsApp', icon: <MessageSquare className="h-4 w-4" />, color: 'bg-green-600' },
];

export const BlogPostForm = ({ onSuccess, onCancel }: BlogPostFormProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [socialTags, setSocialTags] = useState<SocialTagWithIcon[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [handle, setHandle] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const addSocialTag = () => {
    if (selectedPlatform && handle.trim()) {
      const platform = socialPlatforms.find(p => p.name === selectedPlatform);
      if (platform) {
        const newTag: SocialTagWithIcon = {
          platform: selectedPlatform,
          handle: handle.trim(),
          icon: platform.icon,
        };
        setSocialTags(prev => [...prev, newTag]);
        setHandle('');
        setSelectedPlatform('');
      }
    }
  };

  const removeSocialTag = (index: number) => {
    setSocialTags(prev => prev.filter((_, i) => i !== index));
  };

  const uploadAttachments = async (): Promise<string[]> => {
    const uploadPromises = attachments.map(async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog-attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('opportunity-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('opportunity-attachments')
        .getPublicUrl(filePath);

      return publicUrl;
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !body.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a blog post",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Upload attachments if any
      const uploadedAttachments = attachments.length > 0 ? await uploadAttachments() : [];

      // Create blog post
      const socialTagsForDb = socialTags.map(tag => ({
        platform: tag.platform,
        handle: tag.handle,
      }));

      const { error } = await supabase
        .from('blog_posts')
        .insert({
          title: title.trim(),
          body: body.trim(),
          attachments: uploadedAttachments,
          social_tags: socialTagsForDb,
          created_by: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Blog post created successfully",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create blog post",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Create Blog Post</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-muted-foreground">Share your thoughts with the community</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter an engaging title..."
              className="text-lg"
              required
            />
          </div>

          {/* Body */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Content *</label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts, insights, or story..."
              className="min-h-[200px] resize-none"
              required
            />
          </div>

          {/* Attachments */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Attachments</label>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="hover-scale"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <input
                id="file-upload"
                type="file"
                multiple
                accept="image/*,video/*,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                    <span className="text-sm truncate">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Media Tags */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Social Media Tags</label>
            <p className="text-xs text-muted-foreground">
              Tag social media pages, groups, or people to mention them in your post
            </p>
            
            <div className="flex gap-2">
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="">Select Platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform.name} value={platform.name}>
                    {platform.name}
                  </option>
                ))}
              </select>
              
              <Input
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                placeholder="@username or page name"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSocialTag())}
              />
              
              <Button
                type="button"
                variant="outline"
                onClick={addSocialTag}
                disabled={!selectedPlatform || !handle.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {socialTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {socialTags.map((tag, index) => {
                  const platform = socialPlatforms.find(p => p.name === tag.platform);
                  return (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="flex items-center gap-2 pr-1"
                    >
                      <div className={`p-1 rounded-full text-white ${platform?.color}`}>
                        {tag.icon}
                      </div>
                      {tag.platform}: @{tag.handle}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSocialTag(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-6">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !title.trim() || !body.trim()}>
              {loading ? 'Publishing...' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};