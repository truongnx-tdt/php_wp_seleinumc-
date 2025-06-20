import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const API_URL = 'http://localhost:5000/api/auth';

const initialForm = { name: '', email: '', password: '', role: 'staff' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const token = JSON.parse(localStorage.getItem('adminUser'))?.token;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL + '/get-users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Không lấy được danh sách user');
      }
      setUsers(await res.json());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openAdd = () => {
    setForm(initialForm);
    setEditId(null);
    setShowModal(true);
  };
  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role });
    setEditId(user._id);
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa user này?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Xóa thất bại');
      }
      toast.success('Xóa user thành công!');
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let res;
      const body = { name: form.name, email: form.email, role: form.role };
      if (editId) {
        res = await fetch(`${API_URL}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      } else {
        body.password = form.password;
        res = await fetch(`${API_URL}/add-user`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(body),
        });
      }
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Lưu thất bại');
      }
      toast.success(editId ? 'Sửa user thành công!' : 'Thêm user thành công!');
      closeModal();
      fetchUsers();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 flex items-center justify-between">Quản trị người dùng
        <button className="bg-green-600 text-white px-4 py-2 rounded ml-4" onClick={openAdd}>Thêm mới</button>
      </h2>
      {loading ? <div>Đang tải...</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow text-sm sm:text-base">
            <thead>
              <tr>
                <th className="py-2 px-2 sm:px-4 border-b">Tên</th>
                <th className="py-2 px-2 sm:px-4 border-b">Email</th>
                <th className="py-2 px-2 sm:px-4 border-b">Vai trò</th>
                <th className="py-2 px-2 sm:px-4 border-b">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="py-2 px-2 sm:px-4 border-b">{u.name}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">{u.email}</td>
                  <td className="py-2 px-2 sm:px-4 border-b capitalize">{u.role}</td>
                  <td className="py-2 px-2 sm:px-4 border-b">
                    <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2" onClick={() => openEdit(u)}>Sửa</button>
                    <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleDelete(u._id)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Modal thêm/sửa user */}
      {showModal && (
        <div className="fixed inset-0 bg-d6d2cc bg-opacity-20 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button type="button" className="absolute top-2 right-2 text-gray-500 text-2xl" onClick={closeModal}>×</button>
            <h3 className="text-lg font-bold mb-4">{editId ? 'Sửa user' : 'Thêm user'}</h3>
            <div className="mb-3">
              <label className="block mb-1">Tên</label>
              <input className="w-full border rounded px-3 py-2" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="mb-3">
              <label className="block mb-1">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
            </div>
            {!editId && (
              <div className="mb-3">
                <label className="block mb-1">Mật khẩu</label>
                <input type="password" className="w-full border rounded px-3 py-2" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
              </div>
            )}
            <div className="mb-4">
              <label className="block mb-1">Vai trò</label>
              <select className="w-full border rounded px-3 py-2" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                <option value="staff">Nhân viên</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users; 