import { supabase } from '@/integrations/supabase/client';

interface SocialMediaSettings {
  facebook_url?: string;
  whatsapp_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
}

interface BlogPost {
  id: string;
  title: string;
  body: string;
  social_tags?: string[];
}

export const getSocialMediaSettings = async (): Promise<SocialMediaSettings | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('social_media_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching social media settings:', error);
    return null;
  }
};

export const generateSocialShareLinks = (post: BlogPost, settings: SocialMediaSettings | null) => {
  const postUrl = `${window.location.origin}/blog?post=${post.id}`;
  const shareText = `${post.title}\n\n${post.body.substring(0, 100)}...`;

  const links: { [key: string]: string } = {};

  // Facebook
  if (settings?.facebook_url && post.social_tags?.includes('Facebook')) {
    links.facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}&quote=${encodeURIComponent(shareText)}`;
  }

  // WhatsApp
  if (settings?.whatsapp_url && post.social_tags?.includes('WhatsApp')) {
    links.whatsapp = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\nRead more: ${postUrl}\n\nJoin our channel: ${settings.whatsapp_url}`)}`;
  }

  // Twitter/X
  if (settings?.twitter_url && post.social_tags?.includes('Twitter/X')) {
    const twitterHandle = settings.twitter_url.startsWith('@') ? settings.twitter_url : `@${settings.twitter_url}`;
    links.twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title}\n\n${post.body.substring(0, 100)}...\n\nRead more: ${postUrl}\n\nFollow us: ${twitterHandle}`)}`;
  }

  // TikTok (opens profile - no direct sharing API)
  if (settings?.tiktok_url && post.social_tags?.includes('TikTok')) {
    const tiktokHandle = settings.tiktok_url.startsWith('@') ? settings.tiktok_url.substring(1) : settings.tiktok_url;
    links.tiktok = `https://www.tiktok.com/@${tiktokHandle}`;
  }

  // Instagram (opens profile - no direct sharing API)
  if (settings?.instagram_url && post.social_tags?.includes('Instagram')) {
    const instagramHandle = settings.instagram_url.startsWith('@') ? settings.instagram_url.substring(1) : settings.instagram_url;
    links.instagram = `https://www.instagram.com/${instagramHandle}`;
  }

  // LinkedIn
  if (settings?.linkedin_url && post.social_tags?.includes('LinkedIn')) {
    links.linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}&summary=${encodeURIComponent(shareText)}`;
  }

  return links;
};

export const openSocialShareLink = (platform: string, url: string) => {
  window.open(url, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');
};