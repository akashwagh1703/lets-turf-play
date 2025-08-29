import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Turf } from '../../types';
import { TurfCard } from '../cards/TurfCard';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface TurfCarouselProps {
  title: string;
  turfs: Turf[];
}

export const TurfCarousel: React.FC<TurfCarouselProps> = ({ title, turfs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const checkScrollability = () => {
    const el = scrollRef.current;
    if (el) {
      const scrollable = el.scrollWidth > el.clientWidth;
      setIsScrollable(scrollable);
      setIsAtStart(el.scrollLeft < 10);
      setIsAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScrollability, 300);
    window.addEventListener('resize', checkScrollability);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [turfs]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.9;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!turfs || turfs.length === 0) {
    return null;
  }

  return (
    <section>
      <h2 className="text-3xl font-bold text-foreground mb-6">{title}</h2>
      <div className="relative group">
        <div
          ref={scrollRef}
          onScroll={checkScrollability}
          className="flex items-stretch overflow-x-auto gap-6 py-2 -mx-4 px-4 scrollbar-hide"
        >
          {turfs.map((turf) => (
            <div key={turf.id} className="flex-shrink-0 w-[300px] sm:w-[340px]">
              <TurfCard turf={turf} />
            </div>
          ))}
        </div>

        {isScrollable && (
          <>
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"
              animate={{ opacity: isAtStart ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"
              animate={{ opacity: isAtEnd ? 0 : 1 }}
              transition={{ duration: 0.3 }}
            />
            <Button
              onClick={() => scroll('left')}
              variant="ghost"
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 z-20 h-14 w-14 !rounded-full bg-card/80 shadow-lifted transition-opacity hover:bg-card',
                'opacity-0 group-hover:opacity-100',
                isAtStart && '!opacity-0 cursor-default'
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-8 h-8 text-foreground" />
            </Button>

            <Button
              onClick={() => scroll('right')}
              variant="ghost"
              className={cn(
                'absolute right-0 top-1/2 -translate-y-1/2 z-20 h-14 w-14 !rounded-full bg-card/80 shadow-lifted transition-opacity hover:bg-card',
                'opacity-0 group-hover:opacity-100',
                isAtEnd && '!opacity-0 cursor-default'
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="w-8 h-8 text-foreground" />
            </Button>
          </>
        )}
      </div>
    </section>
  );
};
