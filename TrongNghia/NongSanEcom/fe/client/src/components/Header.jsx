import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../UserContext';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const handleLogout = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  const navLinks = (
    <>
      <Link to="/products" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
      <Link to="/suppliers" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Nhà cung cấp</Link>
      <Link to="/about" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Giới thiệu</Link>
      <Link to="/contact" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Chúng tôi</Link>
      <Link to="/cart" className="block px-4 py-2" onClick={() => setMenuOpen(false)} aria-label="Giỏ hàng">
        <div className="relative w-fit">
          <svg className="inline w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
          </svg>
        </div>
      </Link>
      {user ? (
        <span className="block px-4 py-2 font-medium">
          Xin chào, {user.name}
          <button onClick={handleLogout} className="ml-2 underline text-sm text-red-200">Đăng xuất</button>
        </span>
      ) : (
        <>
          <Link to="/login" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
          <Link to="/register" className="block px-4 py-2 hover:text-green-300" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-green-700 text-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="text-2xl font-bold tracking-wide hover:opacity-90">
          🌿 Nông Sản Ecom
        </Link>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/products" className="hover:text-green-200">Sản phẩm</Link>
          <Link to="/suppliers" className="hover:text-green-200">Nhà cung cấp</Link>
          <Link to="/about" className="hover:underline">Giới thiệu</Link>
          <Link to="/team" className="hover:underline">Chúng tôi</Link>

          <Link to="/cart" className="relative" aria-label="Giỏ hàng">
            <svg className="w-6 h-6 hover:text-green-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" />
            </svg>
          </Link>

          {user ? (
            <div className="ml-4 flex items-center space-x-2">
              <span className="text-white">Xin chào, <strong>{user.name}</strong></span>
              <button onClick={handleLogout} className="text-sm underline hover:text-red-300">Đăng xuất</button>
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-green-200">Đăng nhập</Link>
              <Link to="/register" className="hover:text-green-200">Đăng ký</Link>
            </>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-green-800 text-white px-4 py-2 space-y-2 shadow-md">
          {navLinks}
        </nav>
      )}
    </header>
  );
};

export default Header;
