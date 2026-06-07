/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });

  useEffect(() => {
    if (images && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  return (
    <div className="space-y-4">
      {/* Main Image Viewport with Hover Zoom */}
      <div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full aspect-[4/3] rounded-2xl overflow-hidden glass border border-gray-200/50 dark:border-gray-800/50 relative cursor-zoom-in bg-bg-surface/20"
      >
        <img
          src={selectedImage}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Magnifier glass layer */}
        <div 
          style={{
            ...zoomStyle,
            backgroundImage: `url(${selectedImage})`,
            backgroundSize: '200%',
            backgroundRepeat: 'no-repeat'
          }}
          className="absolute inset-0 pointer-events-none"
        />
      </div>

      {/* Thumbnails Row */}
      <div className="flex gap-3.5 overflow-x-auto py-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedImage(img)}
            className={`w-20 h-20 rounded-xl overflow-hidden border-2 cursor-pointer flex-shrink-0 transition-colors ${
              selectedImage === img ? 'border-indigo-500' : 'border-transparent'
            }`}
          >
            <img src={img} alt="thumb" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
