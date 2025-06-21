# Hướng dẫn sử dụng Swagger API Documentation

## Tổng quan

Swagger là một công cụ mạnh mẽ để tạo tài liệu API tương tác. Nó cho phép bạn:
- Xem tài liệu API chi tiết
- Test API trực tiếp từ giao diện web
- Hiểu cấu trúc request/response
- Tương tác với API mà không cần Postman

## Truy cập Swagger UI

1. Khởi động server:
```bash
npm run dev
```

2. Mở browser và truy cập:
```
http://localhost:5000/api-docs
```

## Giao diện Swagger

### 1. Header
- **Title**: NongSan E-commerce API
- **Version**: 1.0.0
- **Description**: Mô tả tổng quan về API

### 2. Server Selection
Chọn server để test:
- Development: `http://localhost:5000`
- Production: `https://api.nongsan.com`

### 3. Authentication
Click vào nút **"Authorize"** để thiết lập JWT token:
```
Bearer <your_jwt_token>
```

### 4. API Groups
API được chia thành các nhóm:
- **Authentication**: Đăng nhập, đăng ký, quản lý user
- **Products**: Quản lý sản phẩm
- **Orders**: Quản lý đơn hàng
- **Upload**: Upload file
- **Payment**: Thanh toán PayPal

## Cách sử dụng

### 1. Xem API Documentation
- Mỗi endpoint có mô tả chi tiết
- Hiển thị parameters, request body, responses
- Có ví dụ request/response

### 2. Test API
1. Chọn endpoint muốn test
2. Click **"Try it out"**
3. Điền thông tin cần thiết
4. Click **"Execute"**
5. Xem kết quả response

### 3. Authentication
Để test các API protected:
1. Đăng nhập để lấy token
2. Click **"Authorize"**
3. Nhập: `Bearer <token>`
4. Click **"Authorize"**

## Ví dụ sử dụng

### 1. Đăng nhập
```
POST /api/auth/login
{
  "email": "admin@nongsan.com",
  "password": "admin123"
}
```

### 2. Lấy danh sách sản phẩm
```
GET /api/products?page=1&limit=10&search=rau
```

### 3. Tạo sản phẩm mới
```
POST /api/products
Authorization: Bearer <token>
{
  "name": "Rau cải xanh",
  "description": "Rau cải xanh tươi ngon",
  "price": 25000,
  "category": "Rau xanh",
  "countInStock": 100,
  "unit": "kg",
  "origin": "Hà Nội"
}
```

### 4. Upload ảnh
```
POST /api/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data
file: [chọn file ảnh]
```

## Schema Definitions

Swagger tự động tạo schema cho các models:

### User Schema
```json
{
  "_id": "string",
  "name": "string",
  "email": "string",
  "role": "admin|staff|customer",
  "createdAt": "date-time",
  "updatedAt": "date-time"
}
```

### Product Schema
```json
{
  "_id": "string",
  "name": "string",
  "description": "string",
  "price": "number",
  "images": ["string"],
  "category": "string",
  "countInStock": "number",
  "rating": "number",
  "numReviews": "number",
  "reviews": [Review],
  "unit": "string",
  "origin": "string",
  "discount": "number"
}
```

### Order Schema
```json
{
  "_id": "string",
  "user": "User",
  "orderItems": [OrderItem],
  "shippingAddress": "ShippingAddress",
  "paymentMethod": "string",
  "itemsPrice": "number",
  "taxPrice": "number",
  "shippingPrice": "number",
  "totalPrice": "number",
  "isPaid": "boolean",
  "paidAt": "date-time",
  "isDelivered": "boolean",
  "deliveredAt": "date-time",
  "status": "pending|confirmed|shipped|delivered|cancelled"
}
```

## Response Formats

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Tips & Tricks

### 1. Copy cURL
- Mỗi request có nút "Copy cURL"
- Dễ dàng copy để sử dụng trong terminal

### 2. Response Headers
- Xem response headers để hiểu thêm thông tin
- Có thể thấy content-type, status code

### 3. Search & Filter
- Sử dụng thanh tìm kiếm để tìm endpoint
- Filter theo tags để xem nhóm API

### 4. Model Examples
- Click vào schema để xem ví dụ
- Hiểu cấu trúc data tốt hơn

## Troubleshooting

### 1. CORS Error
- Đảm bảo server đang chạy
- Kiểm tra CORS configuration

### 2. Authentication Error
- Token hết hạn: Đăng nhập lại
- Token sai format: Đảm bảo có "Bearer "

### 3. Validation Error
- Kiểm tra required fields
- Đảm bảo data type đúng

### 4. Server Error
- Kiểm tra server logs
- Đảm bảo database connected

## Development

### Thêm API mới
1. Thêm JSDoc comments vào route
2. Định nghĩa schema nếu cần
3. Restart server để cập nhật docs

### Customize Swagger
- Chỉnh sửa `src/config/swagger.js`
- Thay đổi theme, options
- Thêm custom CSS

## Kết luận

Swagger giúp:
- **Developers**: Hiểu API nhanh chóng
- **Testers**: Test API dễ dàng
- **Frontend**: Tích hợp API chính xác
- **Documentation**: Tài liệu luôn cập nhật

Sử dụng Swagger để tăng hiệu quả development và testing! 