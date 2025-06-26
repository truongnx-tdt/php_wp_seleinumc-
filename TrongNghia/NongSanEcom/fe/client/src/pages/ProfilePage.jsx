import React, { useEffect, useState } from 'react';
import PageTitle from '../components/PageTitle';
import { useUser } from '../UserContext';
import api from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user, updateUser } = useUser();
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({ name: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    // Địa chỉ
    const emptyAddress = { street: '', ward: '', district: '', city: '', country: 'Vietnam', postalCode: '' };
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState(emptyAddress);
    const [addressLoading, setAddressLoading] = useState(false);
    const [addressError, setAddressError] = useState('');
    const [addressSuccess, setAddressSuccess] = useState('');

    // Đổi mật khẩu
    const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [pwLoading, setPwLoading] = useState(false);
    const [pwSuccess, setPwSuccess] = useState(false);
    const [pwError, setPwError] = useState('');

    // Lấy thông tin user mới nhất từ API
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await api.get('/api/auth/profile');
                setProfile(res.data);
                setForm({
                    name: res.data.name || '',
                    phone: res.data.phone || '',
                });
                setAddresses(res.data.addresses || []);
                updateUser(res.data);
            } catch (err) {
                setError('Không thể tải thông tin tài khoản!');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
        // eslint-disable-next-line
    }, []);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await api.put('/api/users/profile', {
                name: form.name,
                email: profile?.email,
                phone: form.phone,
            });
            setProfile(res.data);
            updateUser(res.data);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            setError('Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    // Địa chỉ: Thêm mới
    const handleAddAddress = async e => {
        e.preventDefault();
        setAddressError('');
        setAddressSuccess('');
        // Validate
        if (!newAddress.street || !newAddress.city || !newAddress.district || !newAddress.ward || !newAddress.country) {
            setAddressError('Vui lòng nhập đầy đủ thông tin địa chỉ!');
            return;
        }
        setAddressLoading(true);
        try {
            const res = await api.post('/api/users/profile/addresses', newAddress);
            setAddresses(res.data);
            setNewAddress(emptyAddress);
            toast.success('Đã thêm địa chỉ!');
        } catch (err) {
            setAddressError(err.response?.data?.message || 'Thêm địa chỉ thất bại!');
        } finally {
            setAddressLoading(false);
        }
    };

    // Địa chỉ: Đặt làm mặc định
    const handleSetDefault = async (id) => {
        setAddressLoading(true);
        setAddressError('');
        setAddressSuccess('');
        try {
            await api.put(`/api/users/profile/addresses/${id}/default`);
            // Fetch lại profile để lấy addresses mới nhất
            const res = await api.get('/api/auth/profile');
            setAddresses(res.data.addresses || []);
            toast.success('Đã cập nhật địa chỉ mặc định!');
        } catch (err) {
            setAddressError(err.response?.data?.message || 'Cập nhật thất bại!');
        } finally {
            setAddressLoading(false);
        }
    };

    // Địa chỉ: Xóa
    const handleDeleteAddress = async (id) => {
        if (!window.confirm('Bạn chắc chắn muốn xóa địa chỉ này?')) return;
        setAddressLoading(true);
        setAddressError('');
        setAddressSuccess('');
        try {
            const res = await api.delete(`/api/users/profile/addresses/${id}`);
            setAddresses(res.data.addresses);
            toast.success('Đã xóa địa chỉ!');
        } catch (err) {
            setAddressError(err.response?.data?.message || 'Xóa địa chỉ thất bại!');
        } finally {
            setAddressLoading(false);
        }
    };

    // Đổi mật khẩu
    const handlePwChange = e => {
        setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    };
    const handlePwSubmit = async e => {
        e.preventDefault();
        setPwError('');
        setPwSuccess(false);
        if (!pwForm.currentPassword || !pwForm.newPassword || !pwForm.confirmPassword) {
            setPwError('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // validate for new password, length >= 8, digit, uppercase, lowercase, special character
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(pwForm.newPassword)) {
            toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái viết hoa, chữ cái viết thường, số và ký tự đặc biệt!');
            return;
        }

        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp!');
            return;
        }
        setPwLoading(true);
        try {
            await api.put('/api/users/change-password', {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            setPwSuccess(true);
            setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setPwError(err.response?.data?.message || 'Đổi mật khẩu thất bại!');
        } finally {
            setPwLoading(false);
        }
    };

    // Tìm id địa chỉ mặc định
    const defaultAddress = Array.isArray(addresses) ? addresses.find(a => a.isDefault) : undefined;
    const defaultAddressId = defaultAddress ? defaultAddress.id || defaultAddress._id : undefined;

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <PageTitle title="Thông tin cá nhân" description="Quản lý tài khoản của bạn" />
            {/* Thông tin tài khoản */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-green-700 mb-6">Thông tin tài khoản</h2>
                {error && <div className="text-red-600 mb-4">{error}</div>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 font-medium">Họ tên</label>
                        <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input value={profile?.email || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Số điện thoại</label>
                        <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
                    </div>
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                    {success && <span className="ml-4 text-green-600">Đã lưu!</span>}
                </form>
            </div>
            {/* Địa chỉ */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
                <h2 className="text-xl font-bold text-green-700 mb-4">Địa chỉ giao hàng</h2>
                {addressError && <div className="text-red-600 mb-2">{addressError}</div>}
                {addressSuccess && <div className="text-green-600 mb-2">{addressSuccess}</div>}
                <div className="grid gap-4 mb-4">
                    {!addresses || addresses.length === 0 && <div className="text-gray-500">Chưa có địa chỉ nào.</div>}
                    {addresses && addresses.map(addr => (
                        <div key={addr._id || addr.id} className={`flex flex-col md:flex-row md:items-center justify-between p-3 rounded border ${addr.isDefault ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
                            <div className="flex-1">
                                <div className="font-medium text-gray-800">
                                    {addr.street}, {addr.ward}, {addr.district}, {addr.city}, {addr.country} {addr.postalCode && `- ${addr.postalCode}`}
                                </div>
                                {addr.isDefault && <span className="inline-block text-xs bg-green-600 text-white px-2 py-0.5 rounded ml-2">Mặc định</span>}
                            </div>
                            <div className="flex items-center gap-2 mt-2 md:mt-0">
                                {!addr.isDefault && (
                                    <button onClick={() => handleSetDefault(addr._id || addr.id)} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200">Đặt làm mặc định</button>
                                )}
                                {!addr.isDefault && (
                                    <button onClick={() => handleDeleteAddress(addr._id || addr.id)} className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Xóa</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-2" onSubmit={handleAddAddress}>
                    <input className="border rounded px-3 py-2" placeholder="Số nhà, đường..." value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} disabled={addressLoading} />
                    <input className="border rounded px-3 py-2" placeholder="Phường/Xã" value={newAddress.ward} onChange={e => setNewAddress({ ...newAddress, ward: e.target.value })} disabled={addressLoading} />
                    <input className="border rounded px-3 py-2" placeholder="Quận/Huyện" value={newAddress.district} onChange={e => setNewAddress({ ...newAddress, district: e.target.value })} disabled={addressLoading} />
                    <input className="border rounded px-3 py-2" placeholder="Tỉnh/Thành phố" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} disabled={addressLoading} />
                    <input className="border rounded px-3 py-2" placeholder="Mã bưu điện" value={newAddress.postalCode} onChange={e => setNewAddress({ ...newAddress, postalCode: e.target.value })} disabled={addressLoading} />
                    <input className="border rounded px-3 py-2" placeholder="Quốc gia" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} disabled={addressLoading} />
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow col-span-1 md:col-span-2" disabled={addressLoading}>Thêm</button>
                </form>
            </div>
            {/* Đổi mật khẩu */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
                <h2 className="text-xl font-bold text-green-700 mb-4">Đổi mật khẩu</h2>
                <form className="space-y-4" onSubmit={handlePwSubmit}>
                    <div>
                        <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
                        <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={handlePwChange} className="w-full border rounded px-3 py-2" required />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Mật khẩu mới</label>
                        <input type="password" name="newPassword" value={pwForm.newPassword} onChange={handlePwChange} className="w-full border rounded px-3 py-2" required minLength={6} />
                    </div>
                    <div>
                        <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
                        <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={handlePwChange} className="w-full border rounded px-3 py-2" required minLength={6} />
                    </div>
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow" disabled={pwLoading}>{pwLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
                    {pwSuccess && <span className="ml-4 text-green-600">Đổi mật khẩu thành công!</span>}
                    {pwError && <div className="text-red-600 mt-2">{pwError}</div>}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage; 