import { useEffect } from 'react';
import { clearJwtCookie, removeCurrentUser } from '../../utils/auth';

const CookieChecker = () => {
  useEffect(() => {
    // Ở trang login, chỉ cần clear cookie và localStorage nếu có
    // Không cần gọi API profile
    const clearInvalidData = () => {
      // Clear cookie JWT nếu có
      clearJwtCookie();
      // Clear localStorage nếu có
      removeCurrentUser();
    };

    // Chỉ clear khi ở trang login
    if (window.location.pathname === '/login') {
      clearInvalidData();
    }
  }, []);

  return null; // Component này không render gì
};

export default CookieChecker;