import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ShoppingCart, Users, ChevronLeft, ChevronRight, X, Share2 } from 'lucide-react';

const slides = [
  {
    image: '/images/garri-banner-1.jpeg',
    title: 'Become a Distributor Today!',
    subtitle: 'Netcross Agro Farms',
    description: 'Become a key distributor of our Ijebu Garri and other products from your comfort zone',
    highlight: 'Minimum 20 packs to become a distributor',
  },
  {
    image: '/images/garri-banner-2.jpeg',
    title: 'Premium Ijebu Garri',
    subtitle: '₦3,000 per pack',
    description: 'Stone-free, tasty, nutritious — the ultimate garri for your customers!',
    highlight: 'Delicious & Nutritious',
  },
  {
    image: '/images/garri-banner-3.jpeg',
    title: 'Bulk Orders Available!',
    subtitle: '₦1,000 per dozen',
    description: 'Get bigger discounts on larger quantities. Perfect for retailers and distributors in Kaduna!',
    highlight: 'Discount on bulk orders',
  },
];

const ctaTexts = ['Order Now', 'Become a Distributor'];

const NetcrossAdBanner = () => {
  const [current, setCurrent] = useState(0);
  const [ctaIndex, setCtaIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  const next = useCallback(() => setCurrent(prev => (prev + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent(prev => (prev - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  useEffect(() => {
    const interval = setInterval(() => setCtaIndex(prev => (prev + 1) % ctaTexts.length), 3000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const slide = slides[current];

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600">
      {/* Close button */}
      <div className="absolute top-2 right-2 z-20 flex items-center gap-1.5">
        <button
          onClick={() => {
            const text = "Check out Netcross Ijebu Garri! Premium, stone-free garri. Order now:";
            const url = "https://wa.me/2348024990648?text=Hi%20Netcross%20Farm!%20I'm%20interested%20in%20your%20Ijebu%20Garri.";
            if (navigator.share) {
              navigator.share({ title: 'Netcross Agro Farms', text, url });
            } else {
              window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
            }
          }}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
          aria-label="Share ad"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="bg-black/40 hover:bg-black/60 text-white rounded-full p-1 transition-colors"
          aria-label="Close ad"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sponsored label */}
      <div className="absolute top-2 left-2 z-20 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-medium">
        Sponsored
      </div>

      <div className="flex flex-col md:flex-row items-center">
        {/* Image Section */}
        <div className="relative w-full md:w-2/5 h-48 md:h-56 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
            />
          </AnimatePresence>

          {/* Navigation arrows */}
          <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
            <ChevronLeft className="w-4 h-4 text-orange-700" />
          </button>
          <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition-colors">
            <ChevronRight className="w-4 h-4 text-orange-700" />
          </button>

          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5 md:p-6 text-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-orange-100 text-xs font-semibold uppercase tracking-wider mb-1">
                🌟 {slide.subtitle}
              </p>
              <h3 className="text-xl md:text-2xl font-extrabold mb-2 leading-tight">
                {slide.title}
              </h3>
              <p className="text-orange-50 text-sm mb-3 leading-relaxed line-clamp-2">
                {slide.description}
              </p>
              <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {slide.highlight}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* CTA + Contact */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/2348024990648?text=Hi%20Netcross%20Farm!%20I'm%20interested%20in%20your%20Ijebu%20Garri."
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center gap-2 bg-white text-orange-700 font-bold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={ctaIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-2"
                >
                  {ctaIndex === 0 ? <ShoppingCart className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                  {ctaTexts[ctaIndex]}
                </motion.span>
              </AnimatePresence>
            </a>
            <a
              href="tel:08024990648"
              className="flex items-center gap-1.5 text-orange-100 hover:text-white text-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>08024990648</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetcrossAdBanner;
