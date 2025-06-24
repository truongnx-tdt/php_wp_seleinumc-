import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaStar, FaLeaf, FaTruck, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { MdLocalOffer, MdCategory } from 'react-icons/md';
import { PageSpinner } from '../../components/Spinner';
import ProductCard from '../../components/ProductCard';
import Banner from '../../components/Banner';
import { useProducts } from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';

const Home = () => {
  const navigate = useNavigate();
  
  // Sử dụng custom hooks
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    fetchFeaturedProducts 
  } = useProducts();
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError,
    fetchCategoriesWithProducts 
  } = useCategories();

  useEffect(() => {
    // Fetch featured products và categories khi component mount
    fetchFeaturedProducts(8);
    fetchCategoriesWithProducts();
  }, [fetchFeaturedProducts, fetchCategoriesWithProducts]);

  const features = [
    {
      icon: <FaLeaf className="text-3xl text-green-600" />,
      title: "Nông sản sạch",
      description: "100% nông sản tươi ngon, không chất bảo quản"
    },
    {
      icon: <FaTruck className="text-3xl text-blue-600" />,
      title: "Giao hàng nhanh",
      description: "Giao hàng trong vòng 2-4 giờ tại TP.HCM"
    },
    {
      icon: <FaShieldAlt className="text-3xl text-orange-600" />,
      title: "Đảm bảo chất lượng",
      description: "Cam kết hoàn tiền nếu không hài lòng"
    },
    {
      icon: <MdLocalOffer className="text-3xl text-red-600" />,
      title: "Giá tốt nhất",
      description: "Giá cả cạnh tranh, ưu đãi thường xuyên"
    }
  ];

  const loading = productsLoading || categoriesLoading;

  if (loading) {
    return <PageSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <div className="mb-8">
        <Banner position="home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-green-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black" style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Nông Sản
              <span className="block text-yellow-300">Tươi Ngon</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Kết nối trực tiếp từ nông trại đến bàn ăn của bạn. 
              Nông sản sạch, tươi ngon, giá cả hợp lý.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/products')}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition duration-300 transform hover:scale-105"
              >
                <FaShoppingCart className="inline mr-2" />
                Mua sắm ngay
              </button>
              <button
                onClick={() => navigate('/about')}
                className="border-2 border-white hover:bg-white hover:text-green-800 font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
              >
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Chúng tôi cam kết mang đến những sản phẩm nông sản chất lượng nhất cho bạn
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Danh mục sản phẩm
              </h2>
              <p className="text-lg text-gray-600">
                Khám phá đa dạng các loại nông sản tươi ngon
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <div
                  key={category._id}
                  onClick={() => navigate(`/products?category=${category._id}`)}
                  className="bg-white rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition duration-300 transform hover:scale-105"
                >
                  <MdCategory className="text-4xl text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.productCount || 0} sản phẩm</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Featured Products Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Những sản phẩm được yêu thích nhất
            </p>
          </div>

          {productsError ? (
            <div className="text-center text-red-500 text-lg">{productsError}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={() => navigate('/products')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-lg transition duration-300"
              >
                Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-green-100">Khách hàng hài lòng</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">500+</div>
              <div className="text-green-100">Sản phẩm đa dạng</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-green-100">Nhà cung cấp uy tín</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24h</div>
              <div className="text-green-100">Giao hàng nhanh chóng</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Sẵn sàng mua sắm nông sản tươi ngon?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Đăng ký ngay để nhận thông báo về các ưu đãi đặc biệt và sản phẩm mới
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
            >
              Bắt đầu mua sắm
            </button>
            <button
              onClick={() => navigate('/register')}
              className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
            >
              Đăng ký tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
