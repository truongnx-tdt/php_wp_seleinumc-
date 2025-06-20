import React, { useState } from 'react';

const team = [
  {
    name: 'Nguyễn Văn A',
    position: 'Người sáng lập',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Trần Thị B',
    position: 'Quản lý sản phẩm',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Phạm Văn C',
    position: 'Kỹ sư công nghệ',
    image: 'https://randomuser.me/api/portraits/men/68.jpg',
  },
];

const TeamPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Xử lý gửi form (gửi API, gửi mail,...)
    console.log('Form data:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Chúng tôi là ai?</h1>
        <p className="text-gray-700 text-lg mb-10">
          Đội ngũ trẻ trung, tâm huyết với mục tiêu nâng tầm nông sản Việt và đưa đến tay người tiêu dùng những sản phẩm sạch và tốt cho sức khỏe.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
          {team.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow text-center">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-green-700">{member.name}</h3>
              <p className="text-gray-600">{member.position}</p>
            </div>
          ))}
        </div>

        <h2 className="text-3xl font-bold text-green-700 mb-6">Liên hệ với chúng tôi</h2>
        {submitted && (
          <p className="mb-4 text-green-600 font-semibold">
            Cảm ơn bạn đã gửi liên hệ! Chúng tôi sẽ phản hồi sớm nhất.
          </p>
        )}
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto text-left space-y-4">
          <div>
            <label htmlFor="name" className="block font-semibold mb-1">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Nhập họ và tên"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Nhập email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-semibold mb-1">Nội dung</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Nhập nội dung liên hệ"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white font-semibold px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Gửi liên hệ
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeamPage;
