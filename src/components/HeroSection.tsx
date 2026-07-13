import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, GraduationCap, Briefcase, Globe, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/scholarships?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const stats = [
    { icon: GraduationCap, label: 'Scholarships', value: '1000+' },
    { icon: Briefcase, label: 'Jobs', value: '500+' },
    { icon: Globe, label: 'Countries', value: '50+' },
    { icon: TrendingUp, label: 'Success Stories', value: '10K+' },
  ];

  return (
    <div className="relative bg-gradient-hero py-12 md:py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      {/* Gold glow accents */}
      <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-accent/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-28 -left-10 h-72 w-72 rounded-full bg-primary/40 blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent mb-6">
            Your gateway to global opportunities
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-5 leading-tight">
            Find <span className="text-gradient-gold">Scholarships</span> & <span className="text-gradient-gold">Jobs</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100/90 mb-8 max-w-2xl mx-auto">
            Discover fully-funded scholarships and career opportunities from top universities and organizations worldwide
          </p>
          
          {/* Search Box */}
          <motion.form 
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden ring-1 ring-accent/30">
              <Search className="absolute left-4 text-muted-foreground h-5 w-5" />
              <input
                type="text"
                placeholder="Search scholarships, universities, countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-32 text-foreground focus:outline-none"
              />
              <button 
                type="submit"
                className="absolute right-2 bg-gradient-gold text-brand-navy px-6 py-2 rounded-full font-semibold transition-opacity hover:opacity-90"
              >
                Search
              </button>
            </div>
          </motion.form>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center mb-12"
          >
            <Link
              to="/scholarships"
              className="bg-gradient-gold text-brand-navy px-6 py-3 rounded-lg font-semibold transition-all shadow-gold hover:opacity-90 hover:-translate-y-0.5"
            >
              <GraduationCap className="inline-block w-5 h-5 mr-2 -mt-0.5" />
              Browse Scholarships
            </Link>
            <Link
              to="/jobs"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-6 py-3 rounded-lg font-semibold transition-all hover:-translate-y-0.5"
            >
              <Briefcase className="inline-block w-5 h-5 mr-2 -mt-0.5" />
              Find Jobs
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center rounded-xl border border-white/10 bg-white/5 py-4 backdrop-blur-sm">
                <stat.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-serif text-white">{stat.value}</div>
                <div className="text-sm text-blue-200/80">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
