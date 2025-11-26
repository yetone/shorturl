[English](README.md) | [简体中文](README.zh-CN.md)

# 短链接服务

一个带有分析仪表板的URL缩短服务。创建简短、易记的链接，跳转到您的长URL。通过详细的分析功能跟踪点击并分析性能。

## 特性

- **URL缩短**: 将长链接转换为简短、易记的URL
- **点击分析**: 跟踪点击、来源、用户代理等信息
- **用户仪表板**: 在一个地方管理所有缩短的URL
- **安全认证**: 用户注册和登录，使用JWT

## 技术栈

### 后端
- FastAPI
- SQLAlchemy
- JWT认证
- SQLite（可配置为PostgreSQL、MySQL）

### 前端
- React
- TypeScript
- Tailwind CSS
- React Query
- Recharts用于数据可视化

## 入门指南

### 前提条件
- Python 3.7+
- Node.js 14+
- pnpm

### 后端设置

1. 导航到后端目录：
   ```bash
   cd backend
   ```

2. 创建虚拟环境并激活：
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   ```

3. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

4. 根据`.env.example`创建`.env`文件：
   ```bash
   cp .env.example .env
   ```

5. 运行迁移：
   ```bash
   alembic upgrade head
   ```

6. 启动后端服务器：
   ```bash
   python main.py
   ```

后端将可在 http://localhost:8000 访问

### 前端设置

1. 导航到前端目录：
   ```bash
   cd frontend
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 启动开发服务器：
   ```bash
   pnpm dev
   ```

前端将可在 http://localhost:5173 访问

## API文档

一旦后端运行，您可以访问API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 许可证

本项目采用MIT许可证 - 查看LICENSE文件了解详情。
