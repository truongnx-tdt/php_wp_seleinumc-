import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../UserContext';
import { NAV_LINKS, AUTH_LINKS, ROUTES } from '../constants/navigation';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import authService from '../services/authService';

const NavigationLink = ({ to, children, className = '', onClick }) => (
  <Link
    to={to}
    className={`hover:text-green-200 transition-colors duration-200 ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md mx-4">
      <input
        type="text"
        placeholder="Tìm kiếm nông sản..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600"
      >
        <FaSearch />
      </button>
    </form>
  );
};

const CartIcon = () => (
  <Link to={ROUTES.CART} className="relative group" aria-label="Giỏ hàng">
    <div className="relative p-2 text-white hover:text-green-200 transition-colors duration-200">
      <FaShoppingCart className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
        0
      </span>
    </div>
  </Link>
);

const WishlistIcon = () => (
  <Link to="/wishlist" className="p-2 text-white hover:text-red-400 transition-colors duration-200" aria-label="Yêu thích">
    <FaHeart className="w-6 h-6" />
  </Link>
);

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-green-200 transition-colors duration-200 p-2 rounded-lg hover:bg-green-800"
      >
        <FaUser className="w-5 h-5" />
        <span className="hidden sm:block text-sm font-medium">Xin chào, {user.name}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
          <Link
            to="/profile"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Thông tin cá nhân
          </Link>
          <Link
            to="/orders"
            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            Đơn hàng của tôi
          </Link>
          <hr className="my-2" />
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

const MobileMenu = ({ isOpen, onClose, children }) => (
  <div className={`md:hidden fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
    <div className="fixed inset-0 bg-black bg-opacity-20" onClick={onClose}></div>
    <div className="fixed right-0 top-0 h-full w-64 bg-green-800 shadow-lg transform transition-transform duration-300">
      <div className="flex justify-between items-center p-4 border-b border-green-700">
        <h3 className="text-white font-semibold">Menu</h3>
        <button onClick={onClose} className="text-white hover:text-green-200">
          <FaTimes className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4">
        {children}
      </nav>
    </div>
  </div>
);

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate(ROUTES.HOME);
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Vẫn logout local nếu API fail
      logout();
      navigate(ROUTES.HOME);
      window.location.reload();
    }
  };

  const handleSearch = (searchTerm) => {
    navigate(`/products?keyword=${encodeURIComponent(searchTerm)}`);
  };

  const closeMobileMenu = () => setMenuOpen(false);

  const renderNavLinks = (isMobile = false) => (
    <>
      {NAV_LINKS.map(({ path, label }) => (
        <NavigationLink
          key={path}
          to={path}
          onClick={isMobile ? closeMobileMenu : undefined}
          className={isMobile ? 'block px-4 py-3 text-white hover:bg-green-700 rounded-lg' : ''}
        >
          {label}
        </NavigationLink>
      ))}

      {!isMobile && <CartIcon />}
      {!isMobile && <WishlistIcon />}

      {user ? (
        isMobile ? (
          <div className="space-y-2">
            <div className="px-4 py-2 text-white">
              <p className="font-medium">Xin chào, {user.name}</p>
            </div>
            <Link
              to="/profile"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white hover:bg-green-700 rounded-lg"
            >
              Thông tin cá nhân
            </Link>
            <Link
              to="/orders"
              onClick={closeMobileMenu}
              className="block px-4 py-3 text-white hover:bg-green-700 rounded-lg"
            >
              Đơn hàng của tôi
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeMobileMenu();
              }}
              className="block w-full text-left px-4 py-3 text-red-300 hover:bg-red-900 rounded-lg"
            >
              Đăng xuất
            </button>
          </div>
        ) : (
          <UserMenu user={user} onLogout={handleLogout} />
        )
      ) : (
        AUTH_LINKS.map(({ path, label }) => (
          <NavigationLink
            key={path}
            to={path}
            onClick={isMobile ? closeMobileMenu : undefined}
            className={isMobile ? 'block px-4 py-3 text-white hover:bg-green-700 rounded-lg' : ''}
          >
            {label}
          </NavigationLink>
        ))
      )}
    </>
  );

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-800 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-2xl font-bold tracking-wide hover:opacity-90 transition-opacity">
            <span className="text-3xl">🌿</span>
            <span className="hidden sm:block">Nông Sản Ecom</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 text-sm font-medium">
            {renderNavLinks()}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Mở menu"
          >
            <FaBars className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={menuOpen} onClose={closeMobileMenu}>
        {renderNavLinks(true)}
      </MobileMenu>
    </header>
  );
};

export default Header;
