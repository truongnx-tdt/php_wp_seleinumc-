import { useEffect } from 'react';

const PageTitle = ({ title, description = null }) => {
  useEffect(() => {
    const baseTitle = 'Nông Sản Ecom';
    const fullTitle = title ? `${title} - ${baseTitle}` : baseTitle;
    
    // Update document title
    document.title = fullTitle;
    
    // Update meta description if provided
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }
    
    // Cleanup function to restore original title when component unmounts
    return () => {
      document.title = baseTitle;
      if (description) {
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          metaDescription.setAttribute('content', 'Nông Sản Ecom - Kết nối trực tiếp từ nông trại đến bàn ăn của bạn. Cung cấp nông sản tươi ngon, chất lượng cao với giá cả hợp lý.');
        }
      }
    };
  }, [title, description]);

  return null; // This component doesn't render anything
};

export default PageTitle; 