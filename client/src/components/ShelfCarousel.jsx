import React, { useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ShelfCarousel({ title, subtitle, badge, children, seeAllAction }) {
  const scrollRef = useRef(null);
  const { isDark } = useTheme();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative my-8 sm:my-10 select-none group/shelf w-full max-w-full overflow-hidden">
      {/* Shelf Header */}
      <div className="flex items-end justify-between mb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div>
          <div className="flex items-center gap-2">
            <h2 className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-[#10b981] text-white">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className={`text-xs sm:text-sm mt-0.5 ${isDark ? 'text-[#b3b3b3]' : 'text-slate-600'}`}>
              {subtitle}
            </p>
          )}
        </div>

        {seeAllAction && (
          <button
            onClick={seeAllAction}
            className="text-xs sm:text-sm text-[#10b981] hover:text-[#059669] font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Explore All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Horizontal Carousel Track Container */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          className={`absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-20 sm:w-12 sm:h-28 rounded flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity backdrop-blur-sm border shadow-xl ${isDark
              ? 'bg-black/70 hover:bg-black/90 text-white border-[#5a5a5a]/40'
              : 'bg-white/95 hover:bg-white text-slate-800 border-slate-300 shadow-md'
            }`}
          aria-label="Scroll left"
        >
          <ChevronLeft className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-white' : 'text-slate-800'}`} />
        </button>

        {/* Carousel Content Scroll */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-5 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-2"
        >
          {children}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          className={`absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-20 sm:w-12 sm:h-28 rounded flex items-center justify-center opacity-0 group-hover/shelf:opacity-100 transition-opacity backdrop-blur-sm border shadow-xl ${isDark
              ? 'bg-black/70 hover:bg-black/90 text-white border-[#5a5a5a]/40'
              : 'bg-white/95 hover:bg-white text-slate-800 border-slate-300 shadow-md'
            }`}
          aria-label="Scroll right"
        >
          <ChevronRight className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? 'text-white' : 'text-slate-800'}`} />
        </button>
      </div>
    </div>
  );
}
