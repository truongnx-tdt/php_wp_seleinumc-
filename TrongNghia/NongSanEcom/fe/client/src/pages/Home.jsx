const Home = () => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <h1 className="text-4xl font-bold mb-4 text-green-700">Chào mừng đến với Nông Sản Ecom</h1>
    <p className="mb-8 text-lg text-gray-700 max-w-xl text-center">
      Nền tảng kết nối người mua và nhà cung cấp nông sản uy tín, chất lượng. Khám phá các sản phẩm nông sản tươi ngon và nhà cung cấp đáng tin cậy.
    </p>
    {/* Placeholder for product and supplier sections */}
    <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Sản phẩm nổi bật</h2>
        <p className="text-gray-600">Danh sách các sản phẩm nông sản sẽ hiển thị ở đây.</p>
      </div>
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold text-green-700 mb-2">Nhà cung cấp uy tín</h2>
        <p className="text-gray-600">Danh sách các nhà cung cấp sẽ hiển thị ở đây.</p>
      </div>
    </div>
  </div>
)

export default Home 