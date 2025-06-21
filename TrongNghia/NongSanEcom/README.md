# NongSan E-commerce Full Stack Application

Ứng dụng thương mại điện tử nông sản với đầy đủ backend, admin panel và client frontend.

## Cấu trúc Project

```
NongSanEcom/
├── be/                 # Backend API (Node.js + Express + MongoDB)
├── fe/
│   ├── admin/         # Admin Panel (React + Vite) - Port 3001
│   └── client/        # Client Frontend (React + Vite) - Port 3000
├── package.json       # Root package.json để quản lý toàn bộ project
├── start-dev.bat      # Script chạy trên Windows
└── start-dev.sh       # Script chạy trên Linux/Mac
```

## Cài đặt

### Cài đặt tất cả dependencies (chỉ cần chạy 1 lần)

```bash
npm run install:all
```

Hoặc cài đặt từng project riêng lẻ:

```bash
# Cài đặt dependencies cho root project
npm install

# Cài đặt dependencies cho backend
cd be && npm install

# Cài đặt dependencies cho admin panel
cd fe/admin && npm install

# Cài đặt dependencies cho client
cd fe/client && npm install
```

## Chạy Project

### Cách 1: Sử dụng npm script (Khuyến nghị)

```bash
npm run dev
```

### Cách 2: Sử dụng script files

**Trên Windows:**
```bash
start-dev.bat
```

**Trên Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

Lệnh này sẽ chạy:
- Backend API trên port 5000 (hoặc port được cấu hình trong .env)
- Admin Panel trên port 3001
- Client Frontend trên port 3000

### Chạy từng project riêng lẻ

```bash
# Chạy chỉ backend
npm run dev:be

# Chạy chỉ admin panel
npm run dev:admin

# Chạy chỉ client frontend
npm run dev:client
```

## Build Project

```bash
# Build cả admin và client
npm run build

# Build chỉ admin
npm run build:admin

# Build chỉ client
npm run build:client
```

## Các lệnh khác

```bash
# Chạy backend ở production mode
npm start

# Seed dữ liệu mẫu (chỉ backend)
cd be && npm run seed
```

## Ports

- **Backend API**: 5000 (hoặc port trong .env)
- **Admin Panel**: 3001
- **Client Frontend**: 3000

## Lưu ý

- Đảm bảo MongoDB đang chạy trước khi khởi động backend
- Kiểm tra file `.env` trong thư mục `be/` để cấu hình database và các biến môi trường khác
- Sử dụng `Ctrl + C` để dừng tất cả các process khi chạy `npm run dev`
- Nếu gặp lỗi port đã được sử dụng, hãy kiểm tra và dừng các process đang chạy trên các port tương ứng 