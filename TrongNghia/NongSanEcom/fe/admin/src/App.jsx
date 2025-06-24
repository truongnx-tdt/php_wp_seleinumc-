import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Pages
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Users from './pages/Users.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import Units from './pages/Units.jsx';
import Settings from './pages/Settings.jsx';

// Layouts
import AdminLayout from './layouts/AdminLayout.jsx';

// Protected Routes
import { ProtectedRoute, AdminRoute, StaffRoute } from './components/common/ProtectedRoute.jsx';

// Components
import CookieChecker from './components/common/CookieChecker.jsx';

// Utils
import { getCurrentUser } from './utils/auth.js';

function App() {
  return (
    <Router>
      <div className="App">
        <CookieChecker />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Routes accessible to authenticated users (staff, admin only) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              {/* Routes accessible to staff and admin */}
              <Route element={<StaffRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/units" element={<Units />} />
                <Route path="/settings" element={<Settings />} />
              </Route>

              {/* Routes accessible only to admin users */}
              <Route element={<AdminRoute />}>
                <Route path="/users" element={<Users />} />
              </Route>
            </Route>
          </Route>

          {/* Root route - redirect based on localStorage */}
          <Route path="/" element={<RootRedirect />} />

          {/* Fallback route - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

// Component để xử lý redirect cho route /
const RootRedirect = () => {
  // Kiểm tra localStorage thay vì gọi API
  const user = getCurrentUser();

  // Nếu có user trong localStorage, redirect dựa trên role
  if (user) {
    if (user.role === 'admin' || user.role === 'staff') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Nếu không có user, chuyển về login
  return <Navigate to="/login" replace />;
};

export default App;
