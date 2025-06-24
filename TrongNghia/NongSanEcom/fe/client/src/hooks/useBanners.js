import { useState, useEffect } from 'react';
import { bannerService } from '../services';

const useBanners = (position = 'home', category = null) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await bannerService.getPublicBanners(position, category);
        setBanners(data || []);
      } catch (err) {
        setError(err.message || 'Không thể tải banner');
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [position, category]);

  return { banners, loading, error };
};

export default useBanners; 