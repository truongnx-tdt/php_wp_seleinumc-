import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import ProductsPage from '../pages/Products/ProductsPage';
import ProductDetailPage from '../pages/Products/ProductDetailPage';
import AboutPage from '../pages/About/AboutPage';
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import { ROUTES } from '../constants/navigation';

const RoutesConfig = () => (
    <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
        <Route path={ROUTES.PRODUCTS + '/:id'} element={<ProductDetailPage />} />
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.ABOUT} element={<AboutPage />} />
    </Routes>
);

export default RoutesConfig;