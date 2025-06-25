import { useState, useEffect } from 'react';
import { bannerService } from '../services';

// Fallback banners data với ảnh chất lượng cao
const fallbackBanners = [
  {
    _id: 'fallback-1',
    title: 'Nông Sản Tươi Ngon',
    subtitle: 'Kết nối trực tiếp từ nông trại',
    description: 'Khám phá thế giới nông sản chất lượng cao từ các vùng miền trên khắp cả nước',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=80',
    link: '/products',
    linkText: 'Khám phá ngay',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    position: 'home'
  },
  {
    _id: 'fallback-2',
    title: 'Giao Hàng Nhanh Chóng',
    subtitle: 'Trong vòng 2-4 giờ tại TP.HCM',
    description: 'Cam kết giao hàng nhanh chóng, đảm bảo nông sản luôn tươi ngon khi đến tay bạn',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop&q=80',
    link: '/about',
    linkText: 'Tìm hiểu thêm',
    backgroundColor: '#059669',
    textColor: '#ffffff',
    position: 'home'
  },
  {
    _id: 'fallback-3',
    title: 'Chất Lượng Đảm Bảo',
    subtitle: '100% nông sản sạch, hữu cơ',
    description: 'Tất cả sản phẩm đều được kiểm định chất lượng, không chất bảo quản, an toàn cho sức khỏe',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80',
    link: '/products?category=organic',
    linkText: 'Xem sản phẩm hữu cơ',
    backgroundColor: '#047857',
    textColor: '#ffffff',
    position: 'home'
  }
];

// Hàm validate và clean banner data
const validateBanner = (banner) => {
  if (!banner || typeof banner !== 'object') return null;
  
  // Đảm bảo có ít nhất title hoặc image
  if (!banner.title && !banner.image) return null;
  
  return {
    _id: banner._id || `banner-${Date.now()}-${Math.random()}`,
    title: banner.title || '',
    subtitle: banner.subtitle || '',
    description: banner.description || '',
    image: banner.image || '',
    link: banner.link || '',
    linkText: banner.linkText || '',
    backgroundColor: banner.backgroundColor || '#222',
    textColor: banner.textColor || '#ffffff',
    position: banner.position || 'home',
    category: banner.category || null,
    product: banner.product || null,
    isActive: banner.isActive !== false, // Mặc định là true
    priority: banner.priority || 0,
    startDate: banner.startDate || null,
    endDate: banner.endDate || null,
    createdBy: banner.createdBy || null,
    updatedBy: banner.updatedBy || null,
    createdAt: banner.createdAt || new Date(),
    updatedAt: banner.updatedAt || new Date()
  };
};

// Hàm validate và xử lý ảnh (bao gồm base64)
const validateImage = (imageUrl) => {
  if (!imageUrl || typeof imageUrl !== 'string') return false;
  
  // Kiểm tra nếu là base64
  if (imageUrl.startsWith('data:image/')) {
    return true;
  }
  
  // Kiểm tra URL hợp lệ
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

// Hàm xử lý ảnh base64 từ API
const processImage = (imageData) => {
  if (!imageData || typeof imageData !== 'string') return null;
  
  // Nếu đã là data URL hoặc URL hợp lệ
  if (validateImage(imageData)) {
    return imageData;
  }
  
  // Nếu là base64 string (không có prefix)
  if (imageData && !imageData.startsWith('data:') && !imageData.startsWith('http')) {
    // Thêm prefix cho base64 image
    return `data:image/jpeg;base64,${imageData}`;
  }
  
  return null;
};

// Hàm thêm fallback ảnh nếu ảnh không hợp lệ
const addImageFallback = (banner) => {
  const processedImage = processImage(banner.image);
  
  if (!processedImage) {
    // Sử dụng ảnh fallback dựa trên position
    const fallbackImages = {
      home: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=80',
      products: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=1920&h=1080&fit=crop&q=80',
      category: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1920&h=1080&fit=crop&q=80',
      default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&h=1080&fit=crop&q=80'
    };
    
    banner.image = fallbackImages[banner.position] || fallbackImages.default;
  } else {
    banner.image = processedImage;
  }
  
  return banner;
};

const useBanners = (position = 'home', category = null) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching banners for position:', position, 'category:', category);
        const data = await bannerService.getPublicBanners(position, category);
        console.log('Banner API response:', data);
        
        // Xử lý data từ API
        if (data && Array.isArray(data) && data.length > 0) {
          console.log('Using API banners:', data.length, 'banners');
          
          // Validate và clean từng banner
          const validatedBanners = data
            .map(validateBanner)
            .filter(banner => banner !== null) // Loại bỏ banner không hợp lệ
            .map(addImageFallback) // Thêm fallback ảnh nếu cần và xử lý base64
            .sort((a, b) => (b.priority || 0) - (a.priority || 0)); // Sắp xếp theo priority
          
          if (validatedBanners.length > 0) {
            setBanners(validatedBanners);
          } else {
            // Nếu không có banner hợp lệ, sử dụng fallback
            console.log('No valid banners from API, using fallback data');
            const filteredFallback = fallbackBanners.filter(banner => 
              banner.position === position && (!category || banner.category === category)
            );
            setBanners(filteredFallback.length > 0 ? filteredFallback : fallbackBanners);
          }
        } else {
          console.log('No API banners, using fallback data');
          // Sử dụng fallback data
          const filteredFallback = fallbackBanners.filter(banner => 
            banner.position === position && (!category || banner.category === category)
          );
          setBanners(filteredFallback.length > 0 ? filteredFallback : fallbackBanners);
        }
      } catch (err) {
        console.error('Banner API error:', err);
        console.warn('Banner API not available, using fallback data:', err.message);
        setError(null); // Không hiển thị lỗi vì có fallback data
        
        // Sử dụng fallback data khi API lỗi
        const filteredFallback = fallbackBanners.filter(banner => 
          banner.position === position && (!category || banner.category === category)
        );
        setBanners(filteredFallback.length > 0 ? filteredFallback : fallbackBanners);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [position, category]);

  return { banners, loading, error };
};

export default useBanners; 