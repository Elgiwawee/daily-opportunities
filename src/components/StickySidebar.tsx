import AdSenseAd from './AdSenseAd';
import PopularScholarships from './PopularScholarships';

interface StickySidebarProps {
  className?: string;
}

const StickySidebar = ({ className = '' }: StickySidebarProps) => {
  return (
    <aside className={`hidden lg:block ${className}`}>
      <div className="sticky top-28 space-y-6">
        {/* Ad Slot 1 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
          <AdSenseAd variant="sidebar" />
        </div>
        
        {/* Popular Scholarships Widget */}
        <PopularScholarships />
        
        {/* Ad Slot 2 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3">
          <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
          <AdSenseAd variant="rectangle" />
        </div>
      </div>
    </aside>
  );
};

export default StickySidebar;
