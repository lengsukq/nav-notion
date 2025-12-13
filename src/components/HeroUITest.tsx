'use client'

import { Card, CardBody, CardHeader, Button, Chip, Input, Progress } from '@heroui/react'

export function HeroUITest() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">HeroUI 样式测试</h1>
      
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">测试卡片</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <p>这是一个使用 HeroUI 组件的测试卡片。</p>
          
          <div className="flex gap-2">
            <Button color="primary">主要按钮</Button>
            <Button color="secondary">次要按钮</Button>
            <Button color="success">成功按钮</Button>
            <Button color="warning">警告按钮</Button>
            <Button color="danger">危险按钮</Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Chip>默认标签</Chip>
            <Chip color="primary">主要标签</Chip>
            <Chip color="secondary">次要标签</Chip>
            <Chip color="success">成功标签</Chip>
            <Chip color="warning">警告标签</Chip>
            <Chip color="danger">危险标签</Chip>
          </div>
          
          <Input 
            placeholder="测试输入框"
            label="测试标签"
            description="这是一个测试描述"
          />
          
          <Progress 
            value={75} 
            color="primary"
            showValueLabel={true}
            label="进度条测试"
          />
        </CardBody>
      </Card>
    </div>
  )
}