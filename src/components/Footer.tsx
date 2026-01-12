import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';
import { generateOpportunityUrl } from '@/utils/slugUtils';
import { GraduationCap, Briefcase, FileText, Newspaper, ChevronRight, MessageCircle, Mail, Phone, Facebook, Twitter, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AdSenseAd from './AdSenseAd';
import { useState } from 'react';

interface Opportunity {
  id: string;
  title: string;
  organization: string;
  type: 'scholarship' | 'job';
  created_at: string;
  attachments: any[] | null;
}

interface NewsItem {
  id: string;
  subject: string;
  created_at: string;
  attachments: any[] | null;
}

const CATEGORIES = [
  { name: 'Scholarships', path: '/scholarships', icon: GraduationCap },
  { name: 'Jobs', path: '/jobs', icon: Briefcase },
  { name: 'News', path: '/news', icon: Newspaper },
  { name: 'Blog', path: '/blog', icon: FileText },
];

const socialLinks = [
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61575299694285',
    icon: Facebook,
  },
  {
    name: 'X (Twitter)',
    url: 'https://twitter.com/DailyOpport2925',
    icon: Twitter,
  },
  {
    name: 'WhatsApp Channel',
    url: 'https://whatsapp.com/channel/0029VbAWCijHbFVELXgqdg0i',
    icon: MessageCircle,
  },
  {
    name: 'WhatsApp Group',
    url: 'https://chat.whatsapp.com/I4IiWpHjlIi4HPf8h0eVss',
    icon: Users,
  },
];

// Get first image from attachments if available
const getImageFromAttachments = (attachments: any[] | null): string | null => {
  if (!Array.isArray(attachments) || attachments.length === 0) return null;
  const imageAttachment = attachments.find(att => 
    att.type?.startsWith('image/') || att.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  );
  return imageAttachment?.url || null;
};

const Footer = () => {
  const [moreVisibleCount, setMoreVisibleCount] = useState(5);

  // Fetch more opportunities
  const { data: moreOpportunities = [], isLoading: loadingMore } = useQuery({
    queryKey: ['footer-more-opportunities', moreVisibleCount],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id, title, organization, type, created_at, attachments')
        .order('created_at', { ascending: false })
        .limit(moreVisibleCount);
      
      if (error) throw error;
      return data as Opportunity[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch popular scholarships
  const { data: popularScholarships = [], isLoading: loadingScholarships } = useQuery({
    queryKey: ['footer-popular-scholarships'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('opportunities')
        .select('id, title, organization, type, created_at, attachments')
        .eq('type', 'scholarship')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Opportunity[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch scholarship stories (news)
  const { data: scholarshipStories = [], isLoading: loadingStories } = useQuery({
    queryKey: ['footer-scholarship-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('id, subject, created_at, attachments')
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as NewsItem[];
    },
    staleTime: 5 * 60 * 1000,
  });

  // Fetch category counts
  const { data: categoryCounts } = useQuery({
    queryKey: ['footer-category-counts'],
    queryFn: async () => {
      const [scholarships, jobs, news, blogs] = await Promise.all([
        supabase.from('opportunities').select('id', { count: 'exact' }).eq('type', 'scholarship'),
        supabase.from('opportunities').select('id', { count: 'exact' }).eq('type', 'job'),
        supabase.from('news_items').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
      ]);
      
      return {
        Scholarships: scholarships.count || 0,
        Jobs: jobs.count || 0,
        News: news.count || 0,
        Blog: blogs.count || 0,
      };
    },
    staleTime: 10 * 60 * 1000,
  });

  const loadMoreOpportunities = () => {
    setMoreVisibleCount(prev => prev + 5);
  };

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white">
      {/* More Opportunities Section */}
      <section className="py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">MORE OPPORTUNITIES</h2>
            <div className="flex-1 h-1 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full" />
          </div>
          
          <div className="space-y-4">
            {loadingMore ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg">
                  <Skeleton className="w-20 h-20 rounded-full bg-gray-600" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2 bg-gray-600" />
                    <Skeleton className="h-5 w-3/4 bg-gray-600" />
                  </div>
                </div>
              ))
            ) : (
              moreOpportunities.map((opp) => {
                const imageUrl = getImageFromAttachments(opp.attachments);
                return (
                  <Link
                    key={opp.id}
                    to={generateOpportunityUrl(opp.id, opp.title)}
                    className="group flex items-center gap-4 p-3 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-600 flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={opp.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          {opp.type === 'scholarship' ? (
                            <GraduationCap className="w-8 h-8 text-gray-400" />
                          ) : (
                            <Briefcase className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs uppercase tracking-wider text-gray-400 font-medium">
                        {opp.type === 'scholarship' ? 'SCHOLARSHIPS' : 'JOBS'}
                      </span>
                      <h3 className="text-white font-semibold line-clamp-2 group-hover:text-teal-400 transition-colors">
                        {opp.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">{opp.organization}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-teal-400 flex-shrink-0" />
                  </Link>
                );
              })
            )}
          </div>
          
          <div className="mt-6 text-center">
            <Button 
              onClick={loadMoreOpportunities}
              variant="outline" 
              className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Load more <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd variant="in-feed" />
        </div>
      </div>

      {/* Popular Scholarships Section */}
      <section className="py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Popular Scholarships</h2>
          
          <div className="space-y-3">
            {loadingScholarships ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3">
                  <Skeleton className="w-24 h-16 rounded-lg bg-gray-600" />
                  <Skeleton className="h-5 flex-1 bg-gray-600" />
                </div>
              ))
            ) : (
              popularScholarships.map((scholarship, index) => {
                const imageUrl = getImageFromAttachments(scholarship.attachments);
                return (
                  <Link
                    key={scholarship.id}
                    to={generateOpportunityUrl(scholarship.id, scholarship.title)}
                    className={`group flex items-center gap-4 p-3 rounded-lg hover:bg-gray-700/50 transition-all ${
                      index % 2 === 0 ? 'text-amber-400 hover:text-amber-300' : 'text-white hover:text-teal-400'
                    }`}
                  >
                    <div className="w-24 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={scholarship.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <GraduationCap className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium line-clamp-2 transition-colors">
                      {scholarship.title}
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd variant="in-article" />
        </div>
      </div>

      {/* Scholarship Stories Section */}
      <section className="py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8">Scholarship Stories</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingStories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-lg">
                  <Skeleton className="w-24 h-20 rounded-lg bg-gray-600" />
                  <Skeleton className="h-5 flex-1 bg-gray-600" />
                </div>
              ))
            ) : (
              scholarshipStories.map((story) => {
                const imageUrl = getImageFromAttachments(story.attachments);
                return (
                  <Link
                    key={story.id}
                    to="/news"
                    className="group flex items-center gap-4 p-4 bg-gray-700/30 hover:bg-gray-700/50 rounded-lg transition-all"
                  >
                    <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
                      {imageUrl ? (
                        <img src={imageUrl} alt={story.subject} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Newspaper className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-medium line-clamp-2 group-hover:text-teal-400 transition-colors">
                        {story.subject}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(story.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
          
          <div className="mt-6 text-center">
            <Button asChild variant="outline" className="border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white">
              <Link to="/news">
                View All Stories <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Section */}
      <div className="py-6 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd variant="in-feed" />
        </div>
      </div>

      {/* Popular Categories Section */}
      <section className="py-12 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="flex items-center justify-between p-4 hover:bg-gray-700/50 rounded-lg transition-all group"
              >
                <div className="flex items-center gap-3">
                  <category.icon className="w-5 h-5 text-gray-400 group-hover:text-teal-400" />
                  <span className="text-white font-medium group-hover:text-teal-400 transition-colors">
                    {category.name}
                  </span>
                </div>
                <span className="text-gray-400 font-semibold">
                  {categoryCounts?.[category.name as keyof typeof categoryCounts] || 0}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-olive-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">Daily Opportunities</span>
              </div>
              <p className="text-gray-400 max-w-md mb-6">
                Daily Opportunities connects you with scholarships, jobs, grants and awards across the world.
                Stay updated with the latest opportunities to advance your education and career.
              </p>
              
              {/* WhatsApp CTA */}
              <a 
                href="https://whatsapp.com/channel/0029VbAWCijHbFVELXgqdg0i"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="font-medium">CONNECT WITH US ON WHATSAPP</span>
              </a>
            </div>
            
            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
              <div className="space-y-3">
                <a 
                  href="mailto:contact.dailyopportunities@gmail.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-teal-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  <span>contact.dailyopportunities@gmail.com</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <Phone className="w-5 h-5" />
                  <div>
                    <p>+62 821-2865-7947</p>
                    <p>+2347040930552</p>
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                    title={social.name}
                  >
                    <social.icon className="w-5 h-5 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Daily Opportunities. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
              <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link to="/disclaimer" className="text-gray-400 hover:text-white transition-colors">Disclaimer</Link>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
