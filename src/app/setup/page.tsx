'use client'

import { Card, CardBody, CardHeader, Button, Divider, Link } from '@heroui/react'
import { ArrowLeft, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function SetupGuide() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(key)
      setTimeout(() => setCopied(null), 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const steps = [
    {
      title: '创建 Notion 集成',
      content: `
1. 访问 [Notion 集成页面](https://www.notion.so/my-integrations)
2. 点击 "New integration"
3. 填写集成名称（如：导航管理）
4. 选择工作区
5. 点击 "Submit"
6. 复制生成的 "Internal Integration Token"`
    },
    {
      title: '创建数据库',
      content: `
1. 在 Notion 中创建新页面
2. 添加数据库（表格视图）
3. 创建以下属性：
   - **Title** (标题) - 页面标题
   - **URL** (URL) - 链接地址
   - **Description** (富文本) - 描述信息
   - **Tags** (多选) - 标签
   - **Category** (单选) - 分类
   - **Icon** (富文本) - 图标
   - **Priority** (数字) - 优先级
   - **Status** (单选) - 状态（Published/Draft）`
    },
    {
      title: '连接集成到数据库',
      content: `
1. 打开你创建的数据库页面
2. 点击右上角的 "..." 菜单
3. 选择 "Add connections"
4. 找到你创建的集成并添加
5. 确保集成有读取权限`
    },
    {
      title: '配置环境变量',
      content: `
1. 在项目根目录创建 \`.env.local\` 文件
2. 添加以下内容：

\`\`\`env
NOTION_TOKEN=your_integration_token
NOTION_DATABASE_ID=your_database_id
\`\`\`

3. 替换为你的实际 Token 和数据库 ID`
    }
  ]

  const envExample = `NOTION_TOKEN=your_integration_token
NOTION_DATABASE_ID=your_database_id`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">设置指南</h1>
                <p className="text-gray-300">如何配置 Notion 数据库</p>
              </div>
            </div>
            
            <Button
              variant="light"
              startContent={<ArrowLeft className="w-4 h-4" />}
              onPress={() => window.history.back()}
              className="text-white"
            >
              返回
            </Button>
          </CardHeader>
        </Card>

        {/* Quick Links */}
        <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <h2 className="text-xl font-semibold text-white">快速链接</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-3">
              <Button
                as={Link}
                href="https://www.notion.so/my-integrations"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                startContent={<ExternalLink className="w-4 h-4" />}
              >
                Notion 集成页面
              </Button>
              <Button
                as={Link}
                href="https://developers.notion.com/docs/create-a-notion-integration"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="bordered"
                startContent={<ExternalLink className="w-4 h-4" />}
              >
                官方文档
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Setup Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{step.title}</h3>
                </div>
              </CardHeader>
              <CardBody>
                <div className="text-gray-300 whitespace-pre-line pl-11">
                  {step.content.split('[').map((part, i) => {
                    if (i === 0) return part
                    const [linkText, url] = part.split('](')
                    const [urlPart, rest] = url.split(')')
                    return (
                      <span key={i}>
                        <Link 
                          href={urlPart} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline"
                          size="sm"
                        >
                          {linkText}
                        </Link>
                        {rest}
                      </span>
                    )
                  })}
                </div>
                {index === 3 && (
                  <div className="mt-4 pl-11">
                    <div className="bg-black/30 rounded-lg p-4">
                      <pre className="text-green-400 text-sm font-mono whitespace-pre-line">{envExample}</pre>
                      <Button
                        size="sm"
                        variant="flat"
                        color="secondary"
                        startContent={copied === 'env' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        onPress={() => copyToClipboard(envExample, 'env')}
                        className="mt-2"
                      >
                        {copied === 'env' ? '已复制' : '复制配置'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <h3 className="text-xl font-semibold text-white">使用提示</h3>
          </CardHeader>
          <CardBody>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">标签管理</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 使用一致的标签命名</li>
                  <li>• 避免创建过多重复标签</li>
                  <li>• 考虑使用分类和标签的组合</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">性能优化</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• 合理设置优先级数值</li>
                  <li>• 使用状态控制显示内容</li>
                  <li>• 定期清理不需要的项目</li>
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}