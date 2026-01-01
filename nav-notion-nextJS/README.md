# Notion 导航管理系统

基于 Next.js 15 和 HeroUI 的现代化导航管理系统，使用 Notion API 作为数据源。

## ✨ 功能特性

- 🚀 **现代化界面** - 使用 HeroUI + Tailwind CSS 构建的响应式界面
- 🔗 **Notion 集成** - 直接从 Notion 数据库获取导航数据
- 🔍 **智能搜索** - 支持标题和描述的全文搜索
- 🏷️ **标签过滤** - 基于标签的导航分类
- 💾 **本地缓存** - 智能缓存机制，提升加载速度
- ⚙️ **灵活配置** - 可配置的 Notion Token 和数据库 ID
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🎨 **深色主题** - 优雅的深色渐变背景

## 🛠️ 技术栈

- **前端框架**: Next.js 15 (App Router)
- **UI 组件库**: HeroUI
- **样式**: Tailwind CSS
- **类型安全**: TypeScript
- **图标**: Lucide React
- **数据存储**: 本地存储 + Notion API

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone <your-repo-url>
cd nav-notion
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件：

```env
NOTION_TOKEN=your_notion_integration_token
NOTION_DATABASE_ID=your_database_id
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看应用

## 📋 Notion 数据库配置

### 数据库结构

创建一个新的 Notion 数据库，包含以下属性：

| 属性名 | 类型 | 说明 |
|--------|------|------|
| Title | 标题 | 导航标题 |
| URL | URL | 链接地址 |
| Description | 富文本 | 描述信息 |
| Tags | 多选 | 标签 |
| Category | 单选 | 分类 |
| Icon | 富文本 | 图标 |
| Priority | 数字 | 优先级 |
| Status | 单选 | 状态 (Published/Draft) |

### 设置步骤

1. **创建 Notion 集成**
   - 访问 [Notion 集成页面](https://www.notion.so/my-integrations)
   - 创建新的集成并获取 Token

2. **连接数据库**
   - 在数据库页面添加你的集成连接
   - 确保集成有读取权限

3. **获取数据库 ID**
   - 从数据库 URL 中提取 32 位 ID

详细设置指南请访问应用的 `/setup` 页面。

## 📁 项目结构

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── navigation/    # 导航数据 API
│   │   └── auth/          # 认证检查 API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页
│   └── setup/             # 设置指南页面
├── components/            # React 组件
│   └── NavigationPage.tsx # 主页面组件
├── lib/                   # 工具库
│   ├── notion.ts          # Notion API 服务
│   └── storage.ts         # 本地存储工具
├── types/                 # TypeScript 类型定义
└── utils/                 # 工具函数
```

## 🔧 开发

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
npm start
```

### 代码检查

```bash
npm run lint
```

## 📝 使用说明

1. **首次使用**: 点击右上角的帮助图标查看设置指南
2. **配置连接**: 在设置中输入你的 Notion Token 和 Database ID
3. **添加数据**: 在 Notion 数据库中添加导航项目
4. **搜索过滤**: 使用搜索框和标签进行内容过滤
5. **数据刷新**: 点击刷新按钮获取最新数据

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [HeroUI](https://heroui.com/) - 美观的 UI 组件库
- [Notion](https://notion.so/) - 优秀的笔记和数据库工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用的 CSS 框架