import { X } from 'lucide-react'
import { useState } from 'react'

interface SettingsModalProps {
  onClose: () => void
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const [notionToken, setNotionToken] = useState('')
  const [databaseId, setDatabaseId] = useState('')

  const handleSave = () => {
    // 保存设置逻辑
    localStorage.setItem('notion_token', notionToken)
    localStorage.setItem('database_id', databaseId)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 border border-white/20 rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">设置</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Notion Token
            </label>
            <input
              type="password"
              value={notionToken}
              onChange={(e) => setNotionToken(e.target.value)}
              placeholder="输入你的 Notion Token"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Database ID
            </label>
            <input
              type="text"
              value={databaseId}
              onChange={(e) => setDatabaseId(e.target.value)}
              placeholder="输入你的 Database ID"
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            保存
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  )
}