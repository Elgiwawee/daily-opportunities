import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

// WhatsApp groups bank - centralized for reuse
export const WHATSAPP_GROUPS = [
  { name: "Daily Opportunities Group 1", url: "https://chat.whatsapp.com/HExFL8M75643wWgFz8J2Wk" },
  { name: "Daily Opportunities Group 2", url: "https://chat.whatsapp.com/HqYT7FF4HAZ7taWX3t7LjU" },
  { name: "Daily Opportunities Group 3", url: "https://chat.whatsapp.com/I4IiWpHjlIi4HPf8h0eVss" },
  { name: "WhatsApp Channel", url: "https://whatsapp.com/channel/0029VbAWCijHbFVELXgqdg0i" },
];

// Helper function to get a random WhatsApp group
export const getRandomWhatsAppGroup = () => {
  const randomIndex = Math.floor(Math.random() * WHATSAPP_GROUPS.length);
  return WHATSAPP_GROUPS[randomIndex];
};

const WhatsAppPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(WHATSAPP_GROUPS[0]);
  const [hasShownThisSession, setHasShownThisSession] = useState(false);

  useEffect(() => {
    // Check if popup was shown in current session
    const shownThisSession = sessionStorage.getItem('whatsapp_popup_shown');
    
    if (shownThisSession) {
      setHasShownThisSession(true);
      return;
    }

    // Show popup after a short delay (3 seconds)
    const showTimer = setTimeout(() => {
      const randomGroup = getRandomWhatsAppGroup();
      setCurrentGroup(randomGroup);
      setIsVisible(true);
      sessionStorage.setItem('whatsapp_popup_shown', 'true');
      setHasShownThisSession(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Auto-hide after 15 seconds
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 15000);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleJoin = () => {
    window.open(currentGroup.url, '_blank', 'noopener,noreferrer');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100]"
            onClick={handleClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-8 md:bottom-8 md:w-[380px] z-[101] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 relative">
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-3 rounded-full">
                  <MessageCircle className="text-white" size={28} />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Join Our Community!</h3>
                  <p className="text-white/90 text-sm">Get instant opportunity alerts</p>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <p className="text-gray-700 mb-4">
                🎓 Don't miss out on <strong>scholarships</strong> and <strong>job opportunities</strong>!
                Join our WhatsApp group to receive instant updates.
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <p className="text-green-800 font-medium text-sm">
                  📢 {currentGroup.name}
                </p>
              </div>
              
              <Button
                onClick={handleJoin}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Click to Join Now
              </Button>
              
              <p className="text-gray-400 text-xs text-center mt-3">
                This popup will close automatically
              </p>
            </div>
            
            {/* Progress bar for auto-close */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 15, ease: 'linear' }}
              className="h-1 bg-green-500"
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppPopup;
