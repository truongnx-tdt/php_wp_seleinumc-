import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../../api'
import { toast } from 'react-toastify'
import { useUser } from '../../UserContext'
import { useForm } from '../../hooks/useForm'
import FormInput from '../../components/ui/FormInput'
import Button from '../../components/ui/Button'
import AuthLayout from '../../components/ui/AuthLayout'
import Spinner from '../../components/Spinner'
import PageTitle from '../../components/PageTitle'
import { ROUTES } from '../../constants/navigation'

const Login = () => {
  const { form, loading, setLoading, handleChange } = useForm({ email: '', password: '' })
  const navigate = useNavigate()
  const { login } = useUser()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const data = await loginUser(form)
      localStorage.setItem('token', data.token)
      login(data)
      toast.success('Đăng nhập thành công!')
      navigate(ROUTES.HOME)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <PageTitle 
        title="Đăng nhập" 
        description="Đăng nhập vào tài khoản Nông Sản Ecom để mua sắm nông sản tươi ngon, chất lượng cao."
      />
      
      <AuthLayout 
        title="Đăng nhập"
        footerText="Chưa có tài khoản?"
        footerLink={ROUTES.REGISTER}
        footerLinkText="Đăng ký"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
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
          
          {loading && <Spinner />}
          
          <Button type="submit" loading={loading}>
            Đăng nhập
          </Button>
        </form>
      </AuthLayout>
    </>
  )
}

export default Login 