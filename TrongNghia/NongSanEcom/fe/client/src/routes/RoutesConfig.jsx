import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import Products from '../pages/Products/Products';
import ProductDetailPage from '../pages/Products/ProductDetailPage';
import CartPage from '../pages/Products/CartPage';
import CheckoutPage from '../pages/Products/CheckoutPage';
import OrderDetailPage from '../pages/Products/OrderDetailPage';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import AboutPage from '../pages/About/AboutPage';
import NotFound from '../pages/NotFound';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RoutesConfig = () => (
  <>
    <Header />
    <main className="min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default RoutesConfig;