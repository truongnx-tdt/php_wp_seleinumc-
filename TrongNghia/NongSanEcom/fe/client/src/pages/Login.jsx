import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { loginUser } from '../api'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import { useUser } from '../UserContext'

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useUser()

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await loginUser(form)
      localStorage.setItem('token', data.token)
      login(data)
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-8 px-4">
      <div className="bg-white rounded shadow p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Đăng nhập</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-gray-700">Email</label>
            <input name="email" type="email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Nhập email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label className="block mb-1 text-gray-700">Mật khẩu</label>
            <input name="password" type="password" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400" placeholder="Nhập mật khẩu" value={form.password} onChange={handleChange} required />
          </div>
          {loading && <Spinner />}
          <button type="submit" className="w-full bg-green-700 text-white py-2 rounded font-semibold hover:bg-green-800 transition" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        </form>
        <div className="text-center mt-4 text-sm">
          Chưa có tài khoản? <Link to="/register" className="text-green-700 hover:underline">Đăng ký</Link>
        </div>
      </div>
    </div>
  )
}

export default Login 