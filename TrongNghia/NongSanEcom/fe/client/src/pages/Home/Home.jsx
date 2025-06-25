import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaStar, FaLeaf, FaTruck, FaShieldAlt, FaHeart } from 'react-icons/fa';
import { MdLocalOffer, MdCategory } from 'react-icons/md';
import { PageSpinner } from '../../components/Spinner';
import ProductCard from '../../components/ProductCard';
import BannerFullpage from '../../components/BannerFullpage';
import PageTitle from '../../components/PageTitle';
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <>
      <PageTitle 
        title="Trang chủ" 
        description="Khám phá thế giới nông sản tươi ngon, chất lượng cao từ các vùng miền trên khắp cả nước. Kết nối trực tiếp từ nông trại đến bàn ăn của bạn."
      />
      
      <BannerFullpage position="home">
        <div className="min-h-screen bg-gray-50">
          {/* Welcome Section */}
          <motion.div 
            className="py-20 bg-gradient-to-br from-green-50 to-green-100"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center" variants={itemVariants}>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  Chào mừng đến với
                  <span className="block text-green-600">Nông Sản Ecom</span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-700">
                  Khám phá thế giới nông sản tươi ngon, chất lượng cao từ các vùng miền trên khắp cả nước
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
                  >
                    <FaShoppingCart className="inline mr-2" />
                    Khám phá sản phẩm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/about')}
                    className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
                  >
                    Tìm hiểu thêm
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            className="py-16 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Tại sao chọn chúng tôi?
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Chúng tôi cam kết mang đến những sản phẩm nông sản chất lượng nhất cho bạn
                </p>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center p-6 rounded-lg hover:shadow-lg transition duration-300 bg-white border border-gray-100"
                    variants={itemVariants}
                    whileHover={{ y: -10, scale: 1.02 }}
                  >
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <motion.div 
              className="py-16 bg-gray-50"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div className="text-center mb-12" variants={itemVariants}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Danh mục sản phẩm
                  </h2>
                  <p className="text-lg text-gray-600">
                    Khám phá đa dạng các loại nông sản tươi ngon
                  </p>
                </motion.div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {categories.slice(0, 8).map((category, index) => (
                    <motion.div
                      key={category._id}
                      variants={itemVariants}
                      whileHover={{ y: -5, scale: 1.05 }}
                      onClick={() => navigate(`/products?category=${category._id}`)}
                      className="bg-white rounded-lg p-6 text-center cursor-pointer hover:shadow-lg transition duration-300 border border-gray-100"
                    >
                      <MdCategory className="text-4xl text-green-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600">{category.productCount || 0} sản phẩm</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Featured Products Section */}
          <motion.div 
            className="py-16 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div className="text-center mb-12" variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Sản phẩm nổi bật
                </h2>
                <p className="text-lg text-gray-600">
                  Những sản phẩm được yêu thích nhất
                </p>
              </motion.div>

              {productsError ? (
                <motion.div className="text-center text-red-500 text-lg" variants={itemVariants}>
                  {productsError}
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      variants={itemVariants}
                      whileHover={{ y: -5 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              )}

              {products.length > 0 && (
                <motion.div className="text-center mt-12" variants={itemVariants}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-lg text-lg transition duration-300"
                  >
                    Xem tất cả sản phẩm
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            className="py-16 bg-green-600 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { number: "1000+", label: "Khách hàng hài lòng" },
                  { number: "500+", label: "Sản phẩm đa dạng" },
                  { number: "50+", label: "Nhà cung cấp uy tín" },
                  { number: "24h", label: "Giao hàng nhanh chóng" }
                ].map((stat, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                    <div className="text-green-100">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            className="py-16 bg-gray-900 text-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Sẵn sàng mua sắm nông sản tươi ngon?
                </h2>
                <p className="text-xl text-gray-300 mb-8">
                  Đăng ký ngay để nhận thông báo về các ưu đãi đặc biệt và sản phẩm mới
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/products')}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
                  >
                    Bắt đầu mua sắm
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/register')}
                    className="border-2 border-white hover:bg-white hover:text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition duration-300"
                  >
                    Đăng ký tài khoản
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </BannerFullpage>
    </>
  );
};

export default Home;
