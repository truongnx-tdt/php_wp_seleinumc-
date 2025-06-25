import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaSearch, FaArrowLeft, FaLeaf } from 'react-icons/fa';
import { ROUTES } from '../constants/navigation';
import PageTitle from '../components/PageTitle';

const NotFound = () => {
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

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      <PageTitle 
        title="Trang không tồn tại" 
        description="Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không bao giờ tồn tại. Khám phá các sản phẩm nông sản tươi ngon khác."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
        <motion.div 
          className="max-w-2xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 Number */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="relative">
              <h1 className="text-9xl md:text-[12rem] font-bold text-green-600 opacity-20">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <FaLeaf className="text-6xl md:text-8xl text-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Title */}
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            Trang không tồn tại
          </motion.h2>

          {/* Description */}
          <motion.p 
            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
            variants={itemVariants}
          >
            Trang bạn đang tìm kiếm có thể đã bị di chuyển, xóa hoặc không bao giờ tồn tại.
          </motion.p>

          {/* Search Box */}
          <motion.div 
            className="mb-8"
            variants={itemVariants}
          >
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full px-4 py-3 pl-12 pr-4 text-gray-900 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-sm"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={itemVariants}
          >
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md"
            >
              <FaArrowLeft className="text-sm" />
              <span>Quay lại</span>
            </motion.button>

            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={() => window.location.href = ROUTES.HOME}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md"
            >
              <FaHome className="text-sm" />
              <span>Về trang chủ</span>
            </motion.button>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="mt-12"
            variants={itemVariants}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Có thể bạn quan tâm:
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: 'Sản phẩm', href: ROUTES.PRODUCTS, color: 'bg-blue-500 hover:bg-blue-600' },
                { name: 'Danh mục', href: ROUTES.CATEGORIES, color: 'bg-purple-500 hover:bg-purple-600' },
                { name: 'Giới thiệu', href: ROUTES.ABOUT, color: 'bg-orange-500 hover:bg-orange-600' },
              ].map((link, index) => (
                <motion.div
                  key={link.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.href}
                    className={`inline-block ${link.color} text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div 
            className="absolute top-10 left-10 opacity-10"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <FaLeaf className="text-4xl text-green-600" />
          </motion.div>

          <motion.div 
            className="absolute bottom-10 right-10 opacity-10"
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <FaLeaf className="text-3xl text-green-600" />
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default NotFound; 