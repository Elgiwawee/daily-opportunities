import AdSenseAd from './AdSenseAd';
import PopularScholarships from './PopularScholarships';

interface StickySidebarProps {
  className?: string;
}

const StickySidebar = ({ className = '' }: StickySidebarProps) => {
  return (
    <aside className={`hidden lg:block ${className}`}>
      <div className="sticky top-28 space-y-6">
        {/* Display Ad - Sidebar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
          <AdSenseAd variant="sidebar" />
        </div>
        
        {/* Popular Scholarships Widget */}
        <PopularScholarships />
        
        {/* In-Feed Ad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Sponsored</p>
          <AdSenseAd variant="in-feed" />
        </div>
        
        {/* In-Article Ad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
          <AdSenseAd variant="in-article" />
        </div>
        
        {/* Rectangle Display Ad */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Sponsored</p>
          <AdSenseAd variant="rectangle" />
        </div>
      </div>
    </aside>
  );
};

export default StickySidebar;
