# Foody Buddy - Food Recommendation System

Foody Buddy là một hệ thống gợi ý món ăn thông minh sử dụng AI, được xây dựng với NestJS backend và React frontend.

## 🏗️ Kiến trúc hệ thống

-   **Backend**: NestJS (TypeScript) với PostgreSQL database và TypeORM
-   **Frontend**: React + TypeScript + Vite + ShadCN UI + TanStack Query
-   **AI/ML**: Vector database (Qdrant) và Google Generative AI (Genkit)
-   **Authentication**: JWT với Passport
-   **Containerization**: Docker và Docker Compose

## �️ Tech Stack

### Backend
- **Framework**: NestJS 11.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL với TypeORM 0.3.x
- **Authentication**: Passport.js + JWT
- **AI/ML**: 
  - Google Genkit 1.19.x
  - Qdrant Vector Database
- **Validation**: class-validator, class-transformer
- **Security**: bcryptjs

### Frontend
- **Framework**: React 18.x
- **Build Tool**: Vite 5.x
- **Language**: TypeScript 5.x
- **UI Library**: Radix UI + ShadCN UI
- **Styling**: Tailwind CSS 3.x
- **State Management**: TanStack Query (React Query) 5.x
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Routing**: React Router DOM 6.x

## �📋 Yêu cầu hệ thống

-   Docker & Docker Compose
-   Node.js 18+ (cho cả backend và frontend)
-   npm hoặc yarn
-   Git

## 🚀 Setup nhanh với Docker

### 1. Clone repository

```bash
git clone <repository-url>
cd foody-buddy
```

### 2. Chạy toàn bộ hệ thống

```bash
docker-compose up --build
```

Sau khi chạy thành công:

-   **Frontend**: http://localhost:9999
-   **Backend API**: http://localhost:19999
-   **API Documentation**: http://localhost:19999/docs

## 🔧 Setup chi tiết

### Backend Setup

#### Chạy với Docker (Khuyến nghị)

```bash
cd backend
docker build -t foody-buddy-backend .
docker run -p 19999:3000 foody-buddy-backend
```

#### Chạy native (Development)

```bash
cd backend

# Cài đặt dependencies
npm install

# Chạy development server với hot reload
npm run start:dev

# Build production
npm run build

# Chạy production
npm run start:prod
```

#### Environment Variables (Backend)

Tạo file `.env` trong thư mục `backend`:

```bash
PORT=3000
DATABASE_URL=postgresql://admin:Abc123@160.191.88.194:5432/foody_buddy
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-pro
GEMINI_MAX_TOKENS=1000
GEMINI_TEMPERATURE=0.7
JWT_SECRET=your_jwt_secret
```

### Frontend Setup

#### Chạy với Docker

```bash
cd ui
docker build -t foody-buddy-frontend .
docker run -p 9999:3000 foody-buddy-frontend
```

#### Chạy native (Development)

```bash
cd ui

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build
```

#### Environment Variables (Frontend)

Tạo file `.env` trong thư mục `ui`:

```bash
VITE_BASE_URL=http://localhost:19999/api/v1
```

## 📁 Cấu trúc project

```
foody-buddy/
├── backend/                 # NestJS Backend
│   ├── src/
│   │   ├── ai/             # AI/ML Module (Genkit, Qdrant)
│   │   ├── auth/           # Authentication Module (JWT, Passport)
│   │   ├── onboarding/     # User Onboarding Module
│   │   ├── entities/       # TypeORM Entities
│   │   ├── config/         # Configuration files
│   │   ├── common/         # Common utilities
│   │   ├── app.module.ts   # Root module
│   │   └── main.ts         # NestJS entry point
│   ├── test/               # E2E tests
│   ├── package.json        # Node.js dependencies
│   ├── nest-cli.json       # NestJS CLI config
│   ├── tsconfig.json       # TypeScript config
│   └── Dockerfile
├── ui/                      # React Frontend
│   ├── src/
│   │   ├── components/      # React Components (ShadCN UI)
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services (Axios)
│   │   ├── contexts/       # React Contexts
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── lib/            # Utilities & API Client
│   │   └── types/          # TypeScript Types
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.ts      # Vite config
│   ├── tailwind.config.ts  # Tailwind CSS config
│   └── Dockerfile
├── transform-data/          # Data processing scripts
│   └── data/
│       ├── raw_dataset/     # Raw data
│       └── clean_dataset/   # Processed data
└── docker-compose.yml      # Docker orchestration
```

## 🔑 Các tính năng chính

-   **Authentication**: JWT-based authentication với Passport.js
-   **User Onboarding**: Thu thập preferences người dùng
-   **AI Recommendations**: Gợi ý món ăn dựa trên Google Generative AI (Genkit)
-   **Food Rating**: Đánh giá và feedback món ăn
-   **Vector Search**: Tìm kiếm món ăn thông minh với Qdrant vector database
-   **Type Safety**: Full TypeScript trên cả frontend và backend
-   **ORM**: TypeORM cho database operations

## 📊 Database

Project sử dụng PostgreSQL database với TypeORM. Schema bao gồm:

-   **Users**: Quản lý người dùng và authentication
-   **Food items**: Dữ liệu món ăn và categories
-   **User preferences**: Sở thích người dùng
-   **Ratings**: Đánh giá món ăn
-   **Qdrant Vector DB**: Lưu trữ embeddings cho AI recommendations

## 🛠️ Development

### Backend Development

```bash
cd backend

# Chạy với hot reload
npm run start:dev

# Chạy tests
npm run test

# E2E tests
npm run test:e2e

# Linting
npm run lint

# Format code
npm run format

# Build
npm run build
```

### Frontend Development

```bash
cd ui

# Development server với hot reload
npm run dev

# Linting
npm run lint

# Build for production
npm run build
```

## 🐳 Docker Commands

```bash
# Build và chạy tất cả services
docker-compose up --build

# Chạy background
docker-compose up -d

# Xem logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild một service cụ thể
docker-compose build backend
docker-compose build frontend
```

## 🔍 API Documentation

Backend API sử dụng NestJS với prefix `/api/v1`:

-   **Base URL**: http://localhost:19999/api/v1
-   **Authentication**: `/api/v1/auth/*`
-   **Onboarding**: `/api/v1/onboarding/*`
-   **AI Recommendations**: `/api/v1/ai/*`

Chi tiết API endpoints có thể tìm trong source code tại thư mục `backend/src/`.

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Đảm bảo ports 9999 và 19999 (hoặc 3000) không bị sử dụng
2. **Database connection**: Kiểm tra DATABASE_URL trong environment variables
3. **CORS issues**: CORS đã được enable trong NestJS backend
4. **Node modules**: Nếu gặp lỗi, thử xóa `node_modules` và chạy lại `npm install`
5. **TypeORM connection**: Đảm bảo PostgreSQL database đang chạy và accessible

### Logs

```bash
# Xem logs của tất cả services
docker-compose logs

# Xem logs của một service cụ thể
docker-compose logs backend
docker-compose logs frontend
```

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

[Thêm license thông tin nếu cần]

## 📧 Contact

[Thêm thông tin contact nếu cần]
