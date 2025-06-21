import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../UserContext';
import { NAV_LINKS, AUTH_LINKS, ROUTES } from '../constants/navigation';

const NavigationLink = ({ to, children, className = '', onClick }) => (
  <Link 
    to={to} 
    className={`hover:text-green-200 transition-colors ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

const CartIcon = () => (
  <Link to={ROUTES.CART} className="relative" aria-label="Giỏ hàng">
    <svg className="w-6 h-6 hover:text-green-200 transition-colors" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
    </svg>
  </Link>
);

const UserMenu = ({ user, onLogout }) => (
  <div className="flex items-center space-x-2">
    <span className="text-white">Xin chào, <strong>{user.name}</strong></span>
    <button 
      onClick={onLogout} 
      className="text-sm underline hover:text-red-300 transition-colors"
    >
      Đăng xuất
    </button>
  </div>
);

const MobileMenu = ({ isOpen, onClose, children }) => (
  isOpen && (
    <nav className="md:hidden bg-green-800 text-white px-4 py-2 space-y-2 shadow-md">
      {children}
    </nav>
  )
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    window.location.reload();
  };

  const closeMobileMenu = () => setMenuOpen(false);

  const renderNavLinks = (isMobile = false) => (
    <>
      {NAV_LINKS.map(({ path, label }) => (
        <NavigationLink 
          key={path} 
          to={path} 
          onClick={isMobile ? closeMobileMenu : undefined}
          className={isMobile ? 'block px-4 py-2' : ''}
        >
          {label}
        </NavigationLink>
      ))}
      
      <CartIcon />
      
      {user ? (
        <UserMenu user={user} onLogout={handleLogout} />
      ) : (
        AUTH_LINKS.map(({ path, label }) => (
          <NavigationLink 
            key={path} 
            to={path} 
            onClick={isMobile ? closeMobileMenu : undefined}
            className={isMobile ? 'block px-4 py-2' : ''}
          >
            {label}
          </NavigationLink>
        ))
      )}
    </>
  );

  return (
    <header className="bg-green-700 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4">
        <Link to={ROUTES.HOME} className="text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity">
          🌿 Nông Sản Ecom
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {renderNavLinks()}
        </nav>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Mở menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={menuOpen} onClose={closeMobileMenu}>
        {renderNavLinks(true)}
      </MobileMenu>
    </header>
  );
};

export default Header;
