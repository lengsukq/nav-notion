'use client'

import { Github } from 'lucide-react'
import { Button, Link } from '@heroui/react'

export function NavigationHeader() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">N</span>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">导航管理</h1>
          <p className="text-gray-300">基于 Notion 的导航管理系统</p>
        </div>
      </div>
      
      <Button
        isIconOnly
        as={Link}
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        variant="light"
        className="text-gray-300 hover:text-white"
      >
        <Github className="w-6 h-6" />
      </Button>
    </div>
  )
}