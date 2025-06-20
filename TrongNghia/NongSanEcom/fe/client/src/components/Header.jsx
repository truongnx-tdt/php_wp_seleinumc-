import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../UserContext'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useUser()

  const handleLogout = () => {
    logout()
    navigate('/')
    window.location.reload()
  }

  const navLinks = (
    <>
      <Link to="/" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
      <Link to="/" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Nhà cung cấp</Link>
      <Link to="/" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Giới thiệu</Link>
      <Link to="/" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Chúng tôi</Link>
      <Link to="/cart" className="block px-4 py-2" onClick={() => setMenuOpen(false)} aria-label="Giỏ hàng">
        <svg className="inline w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" /></svg>
      </Link>
      {user ? (
        <span className="block px-4 py-2 font-semibold">{user.name} <button onClick={handleLogout} className="ml-2 underline text-sm">Đăng xuất</button></span>
      ) : (
        <>
          <Link to="/login" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
          <Link to="/register" className="block px-4 py-2 hover:underline" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
        </>
      )}
    </>
  )

  return (
    <header className="bg-green-700 text-white shadow">
      <div className="container mx-auto flex justify-between items-center py-4 px-4">
        <Link to="/" className="font-bold text-2xl">Nông Sản Ecom</Link>
        {/* Desktop menu */}
        <nav className="space-x-2 hidden md:flex items-center">
          <div className="flex space-x-2">
            <Link to="/" className="hover:underline">Sản phẩm</Link>
            <Link to="/" className="hover:underline">Nhà cung cấp</Link>
            <Link to="/" className="hover:underline">Giới thiệu</Link>
            <Link to="/" className="hover:underline">Chúng tôi</Link>
            <Link to="/cart" className="ml-2" aria-label="Giỏ hàng">
              <svg className="inline w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9m-5-9V6a2 2 0 10-4 0v3" /></svg>
            </Link>
          </div>
          {user ? (
            <span className="ml-4 font-semibold">{user.name} <button onClick={handleLogout} className="ml-2 underline text-sm">Đăng xuất</button></span>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Đăng nhập</Link>
              <Link to="/register" className="hover:underline">Đăng ký</Link>
            </>
          )}
        </nav>
        {/* Hamburger for mobile */}
        <button className="md:hidden flex items-center" onClick={() => setMenuOpen(!menuOpen)} aria-label="Mở menu">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden bg-green-800 text-white px-2 pb-4 rounded-b shadow-lg animate-fade-in">
          {navLinks}
        </nav>
      )}
    </header>
  )
}

export default Header 