# NongSan Backend API

Backend API cho ứng dụng thương mại điện tử nông sản.

## Cấu trúc dự án

```
src/
├── constants/          # Constants và configuration
├── controllers/        # Business logic
├── middleware/         # Custom middleware
├── models/            # Database models
├── routes/            # API routes
├── utils/             # Utility functions
├── config/            # Configuration files
├── app.js             # Express app setup
└── server.js          # Server entry point
```

## Tính năng chính

- ✅ Authentication & Authorization (JWT)
- ✅ User Management (Admin, Staff, Customer)
- ✅ Product Management
- ✅ Order Management
- ✅ Payment Integration (PayPal)
- ✅ File Upload (Cloudinary)
- ✅ Input Validation
- ✅ Error Handling
- ✅ Logging
- ✅ Rate Limiting
- ✅ CORS Configuration
- ✅ Pagination
- ✅ **API Documentation (Swagger)**

## Cài đặt

```bash
npm install
```

## Cấu hình môi trường

Tạo file `.env` với các biến sau:

```env
NODE_ENV=development
PORT=5000
MONGO_DB=mongodb://localhost:27017/nongsan
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
FRONTEND_URL=http://localhost:3000
```

## Chạy ứng dụng

```bash
# Development
npm run dev

# Production
npm start

# Seed users data
npm run seed
```

## API Documentation (Swagger)

Sau khi khởi động server, bạn có thể truy cập API documentation tại:

**http://localhost:5000/api-docs**

### Tính năng Swagger:

- 📖 **Interactive Documentation**: Tài liệu API tương tác
- 🧪 **API Testing**: Test API trực tiếp từ giao diện
- 🔐 **Authentication**: Hỗ trợ JWT Bearer token
- 📝 **Request/Response Examples**: Ví dụ request/response
- 🔍 **Search & Filter**: Tìm kiếm và lọc API endpoints
- 📊 **Schema Definitions**: Định nghĩa schema cho tất cả models

### Cách sử dụng Swagger:

1. **Truy cập**: Mở browser và vào `http://localhost:5000/api-docs`
2. **Authentication**: Click "Authorize" và nhập JWT token
3. **Test API**: Chọn endpoint và click "Try it out"
4. **Execute**: Click "Execute" để test API

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/login` | Đăng nhập | Public |
| POST | `/api/auth/register` | Đăng ký khách hàng | Public |
| POST | `/api/auth/logout` | Đăng xuất | Private |
| GET | `/api/auth/profile` | Lấy thông tin profile | Private |
| PUT | `/api/auth/profile` | Cập nhật profile | Private |

### Admin Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/auth/get-users` | Lấy danh sách users | Admin |
| POST | `/api/auth/add-user` | Thêm user mới | Admin |
| PUT | `/api/auth/:id` | Cập nhật user | Admin |
| DELETE | `/api/auth/:id` | Xóa user | Admin |

### Products

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/products` | Lấy danh sách sản phẩm | Public |
| GET | `/api/products/categories` | Lấy danh sách categories | Public |
| GET | `/api/products/category/:category` | Lấy sản phẩm theo category | Public |
| GET | `/api/products/:id` | Lấy chi tiết sản phẩm | Public |
| POST | `/api/products` | Tạo sản phẩm mới | Admin/Staff |
| PUT | `/api/products/:id` | Cập nhật sản phẩm | Admin/Staff |
| DELETE | `/api/products/:id` | Xóa sản phẩm | Admin/Staff |
| POST | `/api/products/:id/reviews` | Tạo review sản phẩm | Private |

### Orders

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/api/orders` | Lấy danh sách đơn hàng | Admin/Staff |
| GET | `/api/orders/myorders` | Lấy đơn hàng của user | Private |
| GET | `/api/orders/:id` | Lấy chi tiết đơn hàng | Private |
| POST | `/api/orders` | Tạo đơn hàng mới | Private |
| PUT | `/api/orders/:id/pay` | Cập nhật trạng thái thanh toán | Private |
| PUT | `/api/orders/:id/deliver` | Cập nhật trạng thái giao hàng | Admin/Staff |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái đơn hàng | Admin/Staff |
| GET | `/api/orders/stats` | Thống kê đơn hàng | Admin |

### File Upload

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/upload` | Upload file | Admin/Staff |
| POST | `/api/upload/multiple` | Upload nhiều file | Admin/Staff |
| DELETE | `/api/upload/:publicId` | Xóa file | Admin/Staff |

### Payment

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/payment/paypal` | Tạo payment PayPal | Private |
| POST | `/api/payment/paypal/execute` | Thực hiện payment PayPal | Private |
| GET | `/api/payment/status/:paymentId` | Kiểm tra trạng thái payment | Private |

### System

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/health` | Health check | Public |
| GET | `/api-docs` | API Documentation | Public |

## Response Format

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

## Authentication

Sử dụng JWT token trong header:

```
Authorization: Bearer <token>
```

## User Roles

- `admin`: Quản trị viên - toàn quyền
- `staff`: Nhân viên - quản lý sản phẩm, đơn hàng
- `customer`: Khách hàng - mua sắm, xem đơn hàng

## Validation

API sử dụng validation cho:
- Email format
- Password strength
- Required fields
- File upload size và type
- Input sanitization

## Error Handling

- 400: Bad Request - Validation errors
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Duplicate data
- 429: Too Many Requests - Rate limit exceeded
- 500: Internal Server Error - Server errors

## Logging

Hệ thống logging với các level:
- INFO: Thông tin hoạt động
- WARN: Cảnh báo
- ERROR: Lỗi
- DEBUG: Debug (chỉ trong development)

## Rate Limiting

- 100 requests per 15 minutes per IP
- Có thể cấu hình trong middleware

## Security Features

- JWT Authentication
- Password hashing (bcrypt)
- Input sanitization
- CORS protection
- Rate limiting
- File upload validation
- SQL injection protection (Mongoose)

## Development

### Cài đặt dependencies mới:
```bash
npm install swagger-jsdoc swagger-ui-express
```

### Chạy seed data:
```bash
npm run seed
```

### Test API với Swagger:
1. Khởi động server: `npm run dev`
2. Mở browser: `http://localhost:5000/api-docs`
3. Test các endpoints trực tiếp từ giao diện