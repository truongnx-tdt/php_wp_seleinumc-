import React from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../hooks/useBanners';

const Banner = ({ position = 'home', category = null, className = '' }) => {
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

  // Lấy banner đầu tiên (có độ ưu tiên cao nhất)
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