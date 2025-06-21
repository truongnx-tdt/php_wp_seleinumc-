import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api';
import { toast } from 'react-toastify';
import { useForm } from '../../hooks/useForm';
import FormInput from '../../components/ui/FormInput';
import Button from '../../components/ui/Button';
import AuthLayout from '../../components/ui/AuthLayout';
import Spinner from '../../components/Spinner';
import { ROUTES } from '../../constants/navigation';

const Register = () => {
  const { form, loading, setLoading, handleChange } = useForm({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }
    
    setLoading(true);
    try {
      await registerUser({ 
        name: form.name, 
        email: form.email, 
        password: form.password 
      });
      toast.success('Đăng ký thành công!');
      navigate(ROUTES.LOGIN);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Đăng ký"
      footerText="Đã có tài khoản?"
      footerLink={ROUTES.LOGIN}
      footerLinkText="Đăng nhập"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
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
          name="password"
          type="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
        />
        
        <FormInput
          name="confirmPassword"
          type="password"
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        
        {loading && <Spinner />}
        
        <Button type="submit" loading={loading}>
          Đăng ký
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register; 