import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

interface SocialMediaSettings {
  id?: string;
  facebook_url?: string;
  whatsapp_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

const Settings = () => {
  const [settings, setSettings] = useState<SocialMediaSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndLoadSettings();
  }, []);

  const checkAuthAndLoadSettings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      
      if (session?.user) {
        await loadSettings(session.user.id);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('social_media_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Error",
        description: "You must be logged in to save settings",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const settingsData = {
        user_id: user.id,
        facebook_url: settings.facebook_url || null,
        whatsapp_url: settings.whatsapp_url || null,
        twitter_url: settings.twitter_url || null,
        tiktok_url: settings.tiktok_url || null,
        instagram_url: settings.instagram_url || null,
        linkedin_url: settings.linkedin_url || null,
      };

      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from('social_media_settings')
          .update(settingsData)
          .eq('id', settings.id);

        if (error) throw error;
      } else {
        // Insert new settings
        const { data, error } = await supabase
          .from('social_media_settings')
          .insert(settingsData)
          .select()
          .single();

        if (error) throw error;
        setSettings(prev => ({ ...prev, id: data.id }));
      }

      toast({
        title: "Success",
        description: "Social media settings saved successfully!",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (field: keyof SocialMediaSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading settings...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="pt-6">
              <SettingsIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
              <p className="text-muted-foreground">
                Please log in to access your settings.
              </p>
            </CardContent>
          </Card>
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
            <SettingsIcon className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-foreground">
              Settings
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            🔧 Configure your social media links for blog sharing
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 Social Media Links
            </CardTitle>
            <p className="text-muted-foreground">
              Add your social media profile links. These will be used when sharing blog posts.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="facebook">Facebook Page URL</Label>
                <Input
                  id="facebook"
                  value={settings.facebook_url || ''}
                  onChange={(e) => updateSetting('facebook_url', e.target.value)}
                  placeholder="https://www.facebook.com/profile.php?id=61575299694285"
                />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp Channel URL</Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp_url || ''}
                  onChange={(e) => updateSetting('whatsapp_url', e.target.value)}
                  placeholder="https://whatsapp.com/channel/0029VbAWCijHbFVELXgqdg0i"
                />
              </div>
              
              <div>
                <Label htmlFor="twitter">X (Twitter) Profile</Label>
                <Input
                  id="twitter"
                  value={settings.twitter_url || ''}
                  onChange={(e) => updateSetting('twitter_url', e.target.value)}
                  placeholder="@DailyOpport2925"
                />
              </div>
              
              <div>
                <Label htmlFor="tiktok">TikTok Profile</Label>
                <Input
                  id="tiktok"
                  value={settings.tiktok_url || ''}
                  onChange={(e) => updateSetting('tiktok_url', e.target.value)}
                  placeholder="@zaharaddeenumar36"
                />
              </div>
              
              <div>
                <Label htmlFor="instagram">Instagram Profile</Label>
                <Input
                  id="instagram"
                  value={settings.instagram_url || ''}
                  onChange={(e) => updateSetting('instagram_url', e.target.value)}
                  placeholder="@muhammadzaharaddeenmargiwa"
                />
              </div>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={settings.linkedin_url || ''}
                  onChange={(e) => updateSetting('linkedin_url', e.target.value)}
                  placeholder="Your LinkedIn profile URL"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;