import React from 'react';

const ProfileInfo = ({ profile, form, onChange, onSubmit, loading, success, error }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <h2 className="text-2xl font-bold text-green-700 mb-6">Thông tin tài khoản</h2>
    {error && <div className="text-red-600 mb-4">{error}</div>}
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block mb-1 font-medium">Họ tên</label>
        <input name="name" value={form.name} onChange={onChange} className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-200" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input value={profile?.email || ''} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
      </div>
      <div>
        <label className="block mb-1 font-medium">Số điện thoại</label>
        <input name="phone" value={form.phone} onChange={onChange} className="w-full border rounded px-3 py-2" />
      </div>
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
      {success && <span className="ml-4 text-green-600">Đã lưu!</span>}
    </form>
  </div>
);

export default ProfileInfo; 