import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import Settings from './pages/Settings.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import ProductCreate from './pages/ProductCreate.jsx';
import ProductEdit from './pages/ProductEdit.jsx';

function PrivateRoute() {
  const user = localStorage.getItem('adminUser');
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}> {/* Bảo vệ các route quản trị */}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/orders" element={<Orders />} />
            {/* products routes */}
            <Route path="/products" element={<Products />} />
            <Route path="/admin/products/create" element={<ProductCreate />} />
            <Route path="/admin/products/:id/edit" element={<ProductEdit />} />

            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
