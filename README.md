# Nav-Notion - 个人导航中心

> 一个基于 Vue 3 和 Notion API 的现代化个人导航页面，支持自定义主题、标签筛选和响应式设计。

![预览图](https://via.placeholder.com/800x400?text=Nav-Notion+Preview)

## ✨ 特性

- 🎨 **现代化设计** - 采用毛玻璃效果和渐变色彩，提供优雅的视觉体验
- 📱 **完全响应式** - 适配各种设备尺寸，从手机到桌面设备
- 🔍 **智能搜索** - 快速查找导航链接
- 🏷️ **标签筛选** - 支持单选和多选两种筛选模式
- 🎯 **卡片布局** - 提供大卡和小卡两种显示模式
- 🌈 **主题定制** - 可自定义主次主题色，提供多种预设颜色
- ⏰ **时间显示** - 实时显示当前时间
- 🔄 **无限滚动** - 自动加载更多内容
- 📁 **配置导入** - 支持通过 JSON 文件导入导航配置
- 🖼️ **动态背景** - 支持从 Notion 数据库加载背景图片

## 🚀 快速开始

### 环境要求

- Node.js 16.0 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/lengsukq/nav-notion.git
   cd nav-notion
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **配置环境变量**
   
   创建 `.env` 文件并添加以下内容：
   ```env
   # Notion API 配置
   VITE_APP_NOTION_TOKEN=your_notion_integration_token_here
   VITE_APP_NOTION_VERSION=2022-06-28
   VITE_APP_NOTION_DATABASE_ID=your_notion_database_id_here
   VITE_APP_PROXY_URL=https://cors-anywhere.herokuapp.com/
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   # 或
   yarn build
   ```

## 🔧 Notion 数据库设置

### 创建 Notion 集成

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations) 页面
2. 点击 "+ New integration" 创建新集成
3. 填写集成名称，选择关联的工作空间
4. 记录 "Internal Integration Token"，这将是你的 `VITE_APP_NOTION_TOKEN`

### 创建导航数据库

1. 在 Notion 中创建一个新的数据库
2. 添加以下属性：
   - `name` (标题) - 导航项名称
   - `url` (文本) - 导航链接
   - `description` (文本) - 导航项描述
   - `tag` (多选) - 导航项标签
   - `icon` (文件 & 媒体) - 导航项图标（可选）
3. 记录数据库 ID，这将是你的 `VITE_APP_NOTION_DATABASE_ID`

### 共享数据库给集成

1. 点击数据库右上角的 "Share" 按钮
2. 点击 "Invite" 
3. 选择你之前创建的集成
4. 点击 "Invite" 完成共享

## 📁 项目结构

```
nav-notion/
├── public/              # 静态资源
├── src/
│   ├── components/      # Vue 组件
│   │   ├── FilterTag.vue        # 标签筛选组件
│   │   ├── NavConfigTable.vue  # 导航配置表格
│   │   ├── NavigationCard.vue   # 导航卡片
│   │   ├── NavigationCards.vue  # 导航卡片列表
│   │   ├── NavigationHeader.vue # 导航头部
│   │   ├── NavigationPage.vue   # 导航页面
│   │   ├── NavigationTags.vue   # 导航标签
│   │   ├── SearchBox.vue        # 搜索框
│   │   ├── SettingsModal.vue    # 设置模态框
│   │   └── TimeDisplay.vue      # 时间显示
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── .env                 # 环境变量
├── .gitignore           # Git 忽略文件
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── tailwind.config.js   # Tailwind 配置
└── vite.config.js       # Vite 配置
```

## 🎨 自定义配置

### 主题色设置

通过设置模态框可以自定义主题色：

1. 点击页面右上角的设置按钮
2. 在"主题色调色板"部分选择或输入颜色值
3. 可以从预设颜色中快速选择
4. 支持分别设置主色和次色

### 卡片显示模式

- **大卡模式** - 显示完整信息，包括标题、描述和标签
- **小卡模式** - 紧凑布局，仅显示标题和图标

### 标签筛选模式

- **单选模式** - 一次只能选择一个标签进行筛选
- **多选模式** - 可以选择多个标签，显示同时匹配所有选中标签的结果

## 🚀 部署

### Vercel 部署

1. 将代码推送到 GitHub 仓库
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量（与本地开发相同）
4. 部署项目

### 其他平台部署

项目基于 Vite 构建，可以轻松部署到任何支持静态网站的平台：

- Netlify
- GitHub Pages
- Cloudflare Pages

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue 3](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Notion API](https://developers.notion.com/) - 强大的内容管理 API
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Pinia](https://pinia.vuejs.org/) - Vue 状态管理库
- [Vue Sonner](https://vue-sonner.vercel.app/) - Vue 3 通知组件
