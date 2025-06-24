import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Về chúng tôi', href: '/about' },
      { name: 'Liên hệ', href: '/contact' },
      { name: 'Tuyển dụng', href: '/careers' },
      { name: 'Tin tức', href: '/news' }
    ],
    support: [
      { name: 'Trung tâm hỗ trợ', href: '/support' },
      { name: 'Hướng dẫn mua hàng', href: '/guide' },
      { name: 'Chính sách đổi trả', href: '/return-policy' },
      { name: 'Bảo mật thông tin', href: '/privacy' }
    ],
    categories: [
      { name: 'Rau củ quả', href: '/products?category=vegetables' },
      { name: 'Trái cây', href: '/products?category=fruits' },
      { name: 'Gạo và ngũ cốc', href: '/products?category=grains' },
      { name: 'Thực phẩm hữu cơ', href: '/products?category=organic' }
    ]
  };

  const socialLinks = [
    { icon: <FaFacebook />, href: '#', label: 'Facebook' },
    { icon: <FaInstagram />, href: '#', label: 'Instagram' },
    { icon: <FaTwitter />, href: '#', label: 'Twitter' },
    { icon: <FaYoutube />, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-3xl">🌿</span>
              <span className="text-2xl font-bold">Nông Sản Ecom</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Kết nối trực tiếp từ nông trại đến bàn ăn của bạn. 
              Chúng tôi cam kết mang đến những sản phẩm nông sản tươi ngon, 
              chất lượng cao với giá cả hợp lý.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-300">
                <FaPhone className="text-green-500" />
                <span>1900 1234</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-300">
                <FaEnvelope className="text-green-500" />
                <span>info@nongsanecom.vn</span>
              </div>
              <div className="flex items-start space-x-3 text-gray-300">
                <FaMapMarkerAlt className="text-green-500 mt-1" />
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Công ty</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hỗ trợ</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh mục</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-gray-300 hover:text-green-400 transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-3">Đăng ký nhận tin</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg transition-colors duration-200">
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-400">
              <Link to="/terms" className="hover:text-green-400 transition-colors duration-200">
                Điều khoản sử dụng
              </Link>
              <Link to="/privacy" className="hover:text-green-400 transition-colors duration-200">
                Chính sách bảo mật
              </Link>
              <Link to="/cookies" className="hover:text-green-400 transition-colors duration-200">
                Chính sách cookie
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {currentYear} Nông Sản Ecom. Tất cả quyền được bảo lưu.</p>
            <p className="mt-2 md:mt-0">
              Được phát triển với ❤️ tại Việt Nam
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 