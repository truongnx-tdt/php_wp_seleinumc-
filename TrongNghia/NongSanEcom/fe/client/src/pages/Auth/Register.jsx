import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { toast } from 'react-toastify';
import { useForm } from '../../hooks/useForm';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/ui/AuthLayout';
import Spinner from '../../components/Spinner';
import PageTitle from '../../components/PageTitle';
import { ROUTES } from '../../constants/navigation';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaMapMarkerAlt } from 'react-icons/fa';

const Register = () => {
  const { form, loading, setLoading, handleChange, setFormValue } = useForm({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    // Địa chỉ mặc định
    street: '',
    city: '',
    district: '',
    ward: '',
    postalCode: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    // Validate mật khẩu < 8, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số, 1 ký tự đặc biệt
    if (form.password.length < 8 || !/[A-Z]/.test(form.password) || !/[a-z]/.test(form.password) || !/[0-9]/.test(form.password) || !/[!@#$%^&*]/.test(form.password)) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự, có ít nhất 1 chữ cái viết hoa, 1 chữ cái viết thường, 1 số, 1 ký tự đặc biệt');
      return;
    }

    // Validate số điện thoại (nếu có)
    if (form.phone && !/^[0-9+\-\s()]{10,15}$/.test(form.phone)) {
      toast.error('Số điện thoại không hợp lệ');
      return;
    }

    // Validate địa chỉ
    if (!form.street || !form.city || !form.district || !form.ward || !form.postalCode) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        addresses: [{
          street: form.street,
          city: form.city,
          district: form.district,
          ward: form.ward,
          postalCode: form.postalCode,
          country: 'Vietnam',
          isDefault: true
        }]
      };

      await registerUser(userData);
      toast.success('Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Đăng ký"
        description="Tạo tài khoản mới trên Nông Sản Ecom để bắt đầu mua sắm nông sản tươi ngon, chất lượng cao."
      />

      <AuthLayout
        title="Đăng ký"
        footerText="Đã có tài khoản?"
        footerLink={ROUTES.LOGIN}
        footerLinkText="Đăng nhập"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Thông tin cá nhân */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <FaUser className="mr-2 text-green-600" />
              Thông tin cá nhân
            </h3>

            <FormInput
              name="name"
              type="text"
              label="Họ và tên"
              placeholder="Nhập họ và tên"
              value={form.name}
              onChange={handleChange}
              required
            />

            <FormInput
              name="email"
              type="email"
              label="Email"
              placeholder="Nhập email"
              value={form.email}
              onChange={handleChange}
              required
            />

            <FormInput
              name="phone"
              type="tel"
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
            />

            <FormInput
              name="password"
              type="password"
              label="Mật khẩu"
              placeholder="Tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt"
              value={form.password}
              onChange={handleChange}
              required
            />
            
            {/* Password requirements helper */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-2">Yêu cầu mật khẩu:</p>
              <ul className="space-y-1">
                <li className={`flex items-center ${form.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${form.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Ít nhất 8 ký tự
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Có ít nhất 1 chữ cái viết hoa
                </li>
                <li className={`flex items-center ${/[a-z]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Có ít nhất 1 chữ cái viết thường
                </li>
                <li className={`flex items-center ${/[0-9]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Có ít nhất 1 số
                </li>
                <li className={`flex items-center ${/[!@#$%^&*]/.test(form.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full mr-2 ${/[!@#$%^&*]/.test(form.password) ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  Có ít nhất 1 ký tự đặc biệt (!@#$%^&*)
                </li>
              </ul>
            </div>

            <FormInput
              name="confirmPassword"
              type="password"
              label="Nhập lại mật khẩu"
              placeholder="Nhập lại mật khẩu để xác nhận"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            
            {/* Password confirmation helper */}
            {form.confirmPassword && (
              <div className={`text-sm p-2 rounded-lg ${
                form.password === form.confirmPassword 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-red-600 bg-red-50'
              }`}>
                {form.password === form.confirmPassword 
                  ? '✓ Mật khẩu xác nhận khớp' 
                  : '✗ Mật khẩu xác nhận không khớp'
                }
              </div>
            )}
          </div>

          {/* Thông tin địa chỉ */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-green-600" />
              Địa chỉ giao hàng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="city"
                type="text"
                label="Tỉnh/Thành phố"
                placeholder="Ví dụ: TP.HCM"
                value={form.city}
                onChange={handleChange}
                required
              />

              <FormInput
                name="district"
                type="text"
                label="Quận/Huyện"
                placeholder="Ví dụ: Quận 1"
                value={form.district}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                name="ward"
                type="text"
                label="Phường/Xã"
                placeholder="Ví dụ: Phường Bến Nghé"
                value={form.ward}
                onChange={handleChange}
                required
              />

              <FormInput
                name="postalCode"
                type="text"
                label="Mã bưu điện"
                placeholder="Ví dụ: 70000"
                value={form.postalCode}
                onChange={handleChange}
                required
              />
            </div>

            <FormInput
              name="street"
              type="textarea"
              label="Địa chỉ chi tiết"
              placeholder="Số nhà, tên đường, tên khu vực, tòa nhà, căn hộ..."
              value={form.street}
              onChange={handleChange}
              required
              rows={3}
            />
          </div>

          {loading && <Spinner />}

          <Button type="submit" loading={loading}>
            Đăng ký
          </Button>
        </form>
      </AuthLayout>
    </>
  );
};

export default Register; 