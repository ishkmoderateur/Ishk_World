"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: string;
  title: string;
  category: string;
  image: string;
  description?: string;
}

interface PhotographyGalleryProps {
  photos: Photo[];
  onClose?: () => void;
}

export default function PhotographyGallery({
  photos,
  onClose,
}: PhotographyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentPhoto = photos[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
      } else if (e.key === "Escape" && onClose) {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photos.length, onClose]);

  if (photos.length === 0) {
    return (
      <div className="text-center py-12 text-charcoal/60">
        No photos available
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black/95 backdrop-blur-sm">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      )}

      {/* Main Image Display */}
      <div className="relative w-full h-full flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full max-w-7xl mx-auto px-4 md:px-8"
          >
            <div className="grid lg:grid-cols-2 gap-8 items-center h-full py-8">
              {/* Image */}
              <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-900">
                <Image
                  src={currentPhoto.image}
                  alt={currentPhoto.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Text Content */}
              <div className="text-white space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm font-medium mb-4">
                    {currentPhoto.category}
                  </span>
                  <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                    {currentPhoto.title}
                  </h2>
                  {currentPhoto.description && (
                    <p className="text-lg text-white/80 leading-relaxed">
                      {currentPhoto.description}
                    </p>
                  )}
                </div>

                {/* Photo Counter */}
                <div className="text-white/60 text-sm">
                  {currentIndex + 1} / {photos.length}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
          aria-label="Next photo"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnail Strip - Show up to 10 thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide justify-center">
            {(() => {
              // Calculate which photos to show (centered around current, max 10)
              const maxThumbnails = 10;
              const half = Math.floor(maxThumbnails / 2);
              let startIndex = Math.max(0, currentIndex - half);
              let endIndex = Math.min(photos.length, startIndex + maxThumbnails);
              
              // Adjust if we're near the end
              if (endIndex - startIndex < maxThumbnails) {
                startIndex = Math.max(0, endIndex - maxThumbnails);
              }
              
              const visiblePhotos = photos.slice(startIndex, endIndex);
              
              return visiblePhotos.map((photo, index) => {
                const actualIndex = startIndex + index;
                const isActive = actualIndex === currentIndex;
                
                return (
                  <button
                    key={photo.id}
                    onClick={() => goToSlide(actualIndex)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      isActive
                        ? "border-white scale-110"
                        : "border-white/30 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={photo.image}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                  </button>
                );
              });
            })()}
          </div>
          {photos.length > 10 && (
            <div className="text-center text-white/60 text-xs mt-2">
              {currentIndex + 1} / {photos.length}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

