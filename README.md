# Foody Buddy - Food Recommendation System

Foody Buddy là một hệ thống gợi ý món ăn thông minh sử dụng AI, được xây dựng với FastAPI backend và React frontend.

## 🏗️ Kiến trúc hệ thống

-   **Backend**: FastAPI (Python) với PostgreSQL database
-   **Frontend**: React + TypeScript + Vite + ShadCN UI
-   **AI/ML**: Vector database (Qdrant) và Google Generative AI
-   **Containerization**: Docker và Docker Compose

## 📋 Yêu cầu hệ thống

-   Docker & Docker Compose
-   Node.js 18+ (nếu chạy frontend standalone)
-   Python 3.9+ (nếu chạy backend standalone)
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
cd backend-app
docker build -t foody-buddy-backend .
docker run -p 19999:8000 foody-buddy-backend
```

#### Chạy native (Development)

```bash
cd backend-app

# Tạo virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# hoặc venv\Scripts\activate  # Windows

# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### Environment Variables (Backend)

```bash
DATABASE_URL=postgresql://admin:Abc123@160.191.88.194:5432/foody_buddy
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

```bash
VITE_API_URL=http://localhost:19999
```

## 📁 Cấu trúc project

```
foody-buddy/
├── backend-app/              # FastAPI Backend
│   ├── app/
│   │   ├── controllers/      # API Controllers
│   │   ├── services/         # Business Logic
│   │   ├── repositories/     # Data Access Layer
│   │   ├── models/          # Pydantic Models
│   │   ├── core/            # Core configurations
│   │   └── utils/           # Utilities
│   ├── scripts/             # Database scripts
│   ├── main.py              # FastAPI entry point
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── ui/                      # React Frontend
│   ├── src/
│   │   ├── components/      # React Components
│   │   ├── pages/          # Page Components
│   │   ├── services/       # API Services
│   │   ├── contexts/       # React Contexts
│   │   ├── lib/            # Utilities & API Client
│   │   └── types/          # TypeScript Types
│   ├── package.json        # Node.js dependencies
│   └── Dockerfile
├── transform-data/          # Data processing scripts
└── docker-compose.yml      # Docker orchestration
```

## 🔑 Các tính năng chính

-   **Authentication**: JWT-based authentication với refresh tokens
-   **User Onboarding**: Thu thập preferences người dùng
-   **AI Recommendations**: Gợi ý món ăn dựa trên AI và user preferences
-   **Food Rating**: Đánh giá và feedback món ăn
-   **Vector Search**: Tìm kiếm món ăn thông minh với Qdrant

## 📊 Database

Project sử dụng PostgreSQL database được host remote. Schema bao gồm:

-   Users và authentication
-   Food items và categories
-   User preferences và ratings
-   Vector embeddings cho AI recommendations

## 🛠️ Development

### Backend Development

```bash
cd backend-app

# Chạy với hot reload
uvicorn main:app --reload

# Chạy tests (nếu có)
pytest

# Format code
black .
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

Khi backend đang chạy, bạn có thể truy cập:

-   **Swagger UI**: http://localhost:19999/docs
-   **ReDoc**: http://localhost:19999/redoc

## 🚨 Troubleshooting

### Common Issues

1. **Port conflicts**: Đảm bảo ports 9999 và 19999 không bị sử dụng
2. **Database connection**: Kiểm tra DATABASE_URL trong environment
3. **CORS issues**: Đảm bảo frontend URL được config đúng trong backend

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
