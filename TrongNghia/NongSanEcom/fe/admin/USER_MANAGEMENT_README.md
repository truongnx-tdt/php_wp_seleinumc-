# Quản Lý Người Dùng - Hướng Dẫn Sử Dụng

## Tổng Quan
Chức năng quản lý người dùng đã được cập nhật với các tính năng mới:
- ✅ Pagination (Phân trang)
- ✅ Thêm người dùng mới
- ✅ Sửa thông tin người dùng
- ✅ Xóa người dùng
- ✅ Role-based access control

## Các Tính Năng

### 1. Phân Trang (Pagination)
- **Hiển thị**: 10 người dùng mỗi trang
- **Navigation**: Nút "Trước", "Sau" và số trang
- **Thông tin**: Hiển thị số lượng kết quả và trang hiện tại
- **Responsive**: Tự động ẩn/hiện các nút phù hợp với số trang

### 2. Thêm Người Dùng Mới
- **Form fields**:
  - Họ tên (bắt buộc)
  - Email (bắt buộc)
  - Mật khẩu (bắt buộc khi thêm mới)
  - Vai trò (bắt buộc)
- **Validation**: Kiểm tra email hợp lệ, mật khẩu tối thiểu 6 ký tự
- **API**: `POST /api/auth/add-user`

### 3. Sửa Người Dùng
- **Form fields**: Tương tự thêm mới
- **Mật khẩu**: Tùy chọn (để trống nếu không đổi)
- **API**: `PUT /api/auth/{id}`

### 4. Xóa Người Dùng
- **Confirmation**: Xác nhận trước khi xóa
- **Protection**: Không thể xóa admin
- **API**: `DELETE /api/auth/{id}`

## API Response Format

### Get Users (với pagination)
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "users": [
      {
        "_id": "6856167395fb1d448d956d92",
        "name": "Admin User",
        "email": "admin@nongsan.com",
        "role": "admin",
        "createdAt": "2025-06-21T02:18:27.927Z",
        "updatedAt": "2025-06-21T02:18:27.927Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 3,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### Create User
```json
{
  "name": "New User",
  "email": "user@example.com",
  "password": "password123",
  "role": "staff"
}
```

### Update User
```json
{
  "name": "Updated User",
  "email": "user@example.com",
  "role": "staff"
  // password is optional
}
```

## Components Sử Dụng

### 1. Pagination Component
```jsx
<Pagination
  currentPage={pagination.page}
  totalPages={pagination.totalPages}
  totalItems={pagination.total}
  itemsPerPage={pagination.limit}
  onPageChange={handlePageChange}
/>
```

### 2. Modal Component
```jsx
<Modal
  isOpen={showModal}
  onClose={closeModal}
  title="Thêm người dùng mới"
  size="md"
>
  {/* Form content */}
</Modal>
```

### 3. DataTable Component
```jsx
<DataTable
  columns={columns}
  data={users}
  loading={loading}
  error={error}
  emptyMessage="Chưa có người dùng nào."
  showIndex={true}
/>
```

## Hooks Sử Dụng

### 1. usePagination Hook
```jsx
const { pagination, setPage, updatePagination } = usePagination();

// Change page
setPage(2);

// Update pagination data from API
updatePagination({
  total: 25,
  totalPages: 3,
});
```

### 2. useApi Hook
```jsx
const { get, post, put, delete: deleteApi, loading, error } = useApi();

// Get users with pagination
const response = await get(`${API_ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}`);

// Create user
await post(API_ENDPOINTS.USERS.CREATE, userData);

// Update user
await put(API_ENDPOINTS.USERS.UPDATE(id), updateData);

// Delete user
await deleteApi(API_ENDPOINTS.USERS.DELETE(id));
```

## Role Management

### User Roles
- **admin**: Quản trị viên (có thể quản lý tất cả)
- **staff**: Nhân viên (có thể quản lý sản phẩm, đơn hàng)
- **customer**: Khách hàng (chỉ xem)

### Role Badges
- Admin: Đỏ
- Staff: Xanh dương
- Customer: Xám

## Error Handling

### API Errors
- **401**: Token hết hạn → Tự động logout
- **403**: Không có quyền → Hiển thị thông báo
- **400**: Dữ liệu không hợp lệ → Hiển thị lỗi cụ thể
- **500**: Lỗi server → Thông báo chung

### Form Validation
- Email phải hợp lệ
- Mật khẩu tối thiểu 6 ký tự
- Họ tên không được để trống
- Vai trò phải được chọn

## Responsive Design

### Mobile
- Modal full width
- Pagination buttons stacked
- Table scrollable horizontally

### Desktop
- Modal centered với max-width
- Pagination buttons inline
- Table full width

## Performance Optimizations

1. **Debounced API calls**: Tránh gọi API quá nhiều
2. **Memoized components**: Tối ưu re-renders
3. **Lazy loading**: Chỉ load data khi cần
4. **Optimistic updates**: Cập nhật UI ngay lập tức

## Security Features

1. **Role-based access**: Chỉ admin mới thấy trang này
2. **Input validation**: Validate dữ liệu trước khi gửi
3. **CSRF protection**: Token trong header
4. **XSS prevention**: Sanitize input data 