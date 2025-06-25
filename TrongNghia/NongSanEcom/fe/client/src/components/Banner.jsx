import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../hooks/useBanners';

const Banner = ({ position = 'home', category = null, className = '' }) => {
  const { banners, loading, error } = useBanners(position, category);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    setCurrent(0);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [banners.length]);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="h-64 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  // Nếu chỉ có 1 banner, hiển thị như cũ
  if (banners.length === 1) {
    const banner = banners[0];
    const bannerStyle = {
      backgroundColor: banner.backgroundColor || '#ffffff',
      color: banner.textColor || '#000000',
    };
    return (
      <div 
        className={`relative overflow-hidden rounded-lg shadow-lg ${className}`}
        style={bannerStyle}
      >
        {/* Background Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          {/* Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-6">
              {banner.title && (
                <h2 className="text-2xl md:text-4xl font-bold mb-2">
                  {banner.title}
                </h2>
              )}
              {banner.subtitle && (
                <p className="text-lg md:text-xl mb-4 opacity-90">
                  {banner.subtitle}
                </p>
              )}
              {banner.description && (
                <p className="text-sm md:text-base mb-6 opacity-80 max-w-md mx-auto">
                  {banner.description}
                </p>
              )}
              {banner.link && banner.linkText && (
                <Link
                  to={banner.link}
                  className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  {banner.linkText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Nếu có nhiều banner, hiển thị carousel
  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  };
  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % banners.length);
  };
  const banner = banners[current];
  const bannerStyle = {
    backgroundColor: banner.backgroundColor || '#ffffff',
    color: banner.textColor || '#000000',
  };
  return (
    <div className={`relative overflow-hidden rounded-lg shadow-lg ${className}`} style={bannerStyle}>
      <div className="relative h-64 md:h-80">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover transition-all duration-700"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            {banner.title && (
              <h2 className="text-2xl md:text-4xl font-bold mb-2">
                {banner.title}
              </h2>
            )}
            {banner.subtitle && (
              <p className="text-lg md:text-xl mb-4 opacity-90">
                {banner.subtitle}
              </p>
            )}
            {banner.description && (
              <p className="text-sm md:text-base mb-6 opacity-80 max-w-md mx-auto">
                {banner.description}
              </p>
            )}
            {banner.link && banner.linkText && (
              <Link
                to={banner.link}
                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {banner.linkText}
              </Link>
            )}
          </div>
        </div>
        {/* Carousel controls */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Trước"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 hover:bg-opacity-60 text-white rounded-full p-2 z-10"
          aria-label="Sau"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
        </button>
        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full ${idx === current ? 'bg-white' : 'bg-white bg-opacity-50'} transition-all`}
              aria-label={`Chuyển đến banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Component cho banner carousel
const BannerCarousel = ({ position = 'home', category = null, className = '' }) => {
  const { banners, loading, error } = useBanners(position, category);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`}>
        <div className="h-64 bg-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (error || banners.length === 0) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="overflow-hidden rounded-lg">
        <div className="flex transition-transform duration-500 ease-in-out">
          {banners.map((banner, index) => (
            <div key={banner._id} className="w-full flex-shrink-0">
              <Banner 
                position={position} 
                category={category} 
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className="w-3 h-3 bg-white bg-opacity-50 rounded-full hover:bg-opacity-100 transition-opacity"
              onClick={() => {
                // Implement carousel navigation
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export { BannerCarousel };
export default Banner; 