import React from 'react';

const ProfilePassword = ({ pwForm, onChange, onSubmit, loading, success, error }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mt-8">
    <h2 className="text-xl font-bold text-green-700 mb-4">Đổi mật khẩu</h2>
    <form className="space-y-4" onSubmit={onSubmit}>
      <div>
        <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
        <input type="password" name="currentPassword" value={pwForm.currentPassword} onChange={onChange} className="w-full border rounded px-3 py-2" required />
      </div>
      <div>
        <label className="block mb-1 font-medium">Mật khẩu mới</label>
        <input type="password" name="newPassword" value={pwForm.newPassword} onChange={onChange} className="w-full border rounded px-3 py-2" required minLength={6} />
      </div>
      <div>
        <label className="block mb-1 font-medium">Xác nhận mật khẩu mới</label>
        <input type="password" name="confirmPassword" value={pwForm.confirmPassword} onChange={onChange} className="w-full border rounded px-3 py-2" required minLength={8} />
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow" disabled={loading}>{loading ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
      {success && <span className="ml-4 text-green-600">Đổi mật khẩu thành công!</span>}
      {error && <div className="text-red-600 mt-2">{error}</div>}
    </form>
  </div>
);

export default ProfilePassword; 