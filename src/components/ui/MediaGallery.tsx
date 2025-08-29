import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, X, ChevronLeft, ChevronRight, Grid } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { cn } from '../../lib/utils';

interface MediaGalleryProps {
  images: string[];
  videos: string[];
  turfName: string;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ images, videos, turfName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'photos' | 'videos'>('photos');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const openModal = (tab: 'photos' | 'videos', index: number) => {
    setModalTab(tab);
    setSelectedIndex(index);
    setIsModalOpen(true);
  };

  const handleNext = () => {
    const media = modalTab === 'photos' ? images : videos;
    setSelectedIndex((prev) => (prev + 1) % media.length);
  };

  const handlePrev = () => {
    const media = modalTab === 'photos' ? images : videos;
    setSelectedIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const currentMedia = modalTab === 'photos' ? images : videos;

  return (
    <>
      <div className="relative grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-96 cursor-pointer group shadow-soft border border-border">
        {images.slice(0, 5).map((img, index) => (
          <div
            key={img}
            onClick={() => openModal('photos', index)}
            className={cn(
              'relative overflow-hidden',
              index === 0 ? 'col-span-2 row-span-2' : ''
            )}
          >
            <img src={img} alt={`${turfName} photo ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
        <Button
          onClick={() => openModal('photos', 0)}
          className="absolute bottom-4 right-4 !rounded-lg bg-white/90 !text-foreground hover:!bg-white"
        >
          <Grid className="w-4 h-4 mr-2" />
          Show all photos
        </Button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-0">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    onClick={() => setIsModalOpen(false)}
                />
                
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="relative w-full h-full flex flex-col"
                >
                    <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                        <X className="w-6 h-6" />
                    </button>

                    <div className="flex-grow relative flex items-center justify-center p-16">
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={`${modalTab}-${selectedIndex}`}
                            src={currentMedia[selectedIndex]}
                            alt="Full screen media"
                            className="max-h-full max-w-full object-contain rounded-lg shadow-lifted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        />
                    </AnimatePresence>

                    <Button onClick={handlePrev} variant="ghost" className="absolute left-4 !rounded-full !p-3 bg-black/40 text-white hover:bg-black/60">
                        <ChevronLeft size={28} />
                    </Button>
                    <Button onClick={handleNext} variant="ghost" className="absolute right-4 !rounded-full !p-3 bg-black/40 text-white hover:bg-black/60">
                        <ChevronRight size={28} />
                    </Button>
                    </div>

                    <div className="flex-shrink-0 p-4 flex justify-center items-center gap-4">
                        <Button onClick={() => setModalTab('photos')} variant={modalTab === 'photos' ? 'secondary' : 'ghost'} className={cn(modalTab !== 'photos' && '!text-white/70 hover:!text-white hover:!bg-white/10')} size="sm">
                            <ImageIcon className="w-4 h-4 mr-2" /> Photos ({images.length})
                        </Button>
                        {videos.length > 0 && (
                            <Button onClick={() => setModalTab('videos')} variant={modalTab === 'videos' ? 'secondary' : 'ghost'} className={cn(modalTab !== 'videos' && '!text-white/70 hover:!text-white hover:!bg-white/10')} size="sm">
                                <Video className="w-4 h-4 mr-2" /> Videos ({videos.length})
                            </Button>
                        )}
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </>
  );
};
