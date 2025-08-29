import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Star, Sparkles, IndianRupee } from 'lucide-react';
import { Card } from '../ui/Card';
import { Turf } from '../../types';
import { cn } from '../../lib/utils';
import { AmenityIcon } from '../ui/AmenityIcon';

interface TurfCardProps {
  turf: Turf;
  className?: string;
}

export const TurfCard: React.FC<TurfCardProps> = ({ turf, className }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('h-full', className)}
    >
      <Link to={`/turf/${turf.id}`} className="block h-full">
        <Card className="overflow-hidden group hover:shadow-lifted transition-all duration-300 h-full flex flex-col">
          <div className="aspect-[4/3] relative overflow-hidden">
            <img
              src={turf.images[0]}
              alt={turf.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-foreground px-3 py-1.5 rounded-full text-sm font-bold shadow-md flex items-center gap-1">
              <IndianRupee size={14} className="text-primary" />
              {turf.price}<span className="text-xs font-normal text-muted-foreground ml-0.5">/hr</span>
            </div>

            {turf.tags && turf.tags.includes('Popular') && (
              <div className="absolute top-3 left-3 flex items-center gap-1 text-xs bg-accent text-accent-foreground font-semibold px-2 py-1 rounded-full shadow">
                <Sparkles className="w-3 h-3" /> Popular
              </div>
            )}
          </div>
          
          <div className="p-4 flex-grow flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-foreground truncate flex-1 pr-2">{turf.name}</h3>
              <div className="flex items-center flex-shrink-0">
                <Star className="w-5 h-5 text-orange-400 fill-orange-400 mr-1" />
                <span className="text-sm font-bold">{turf.rating.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mb-4">
              <MapPin className="w-4 h-4 mr-1.5 flex-shrink-0 text-secondary" />
              <span className="truncate">{turf.location}</span>
            </div>
            
            <div className="mt-auto pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Top Amenities</p>
              <div className="flex items-center gap-4 text-muted-foreground">
                {turf.amenities.slice(0, 5).map((amenity) => (
                  <div key={amenity} title={amenity}>
                    <AmenityIcon amenity={amenity} className="w-5 h-5" />
                  </div>
                ))}
                {turf.amenities.length > 5 && (
                  <span className="text-xs font-medium">+ {turf.amenities.length - 5}</span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
};
