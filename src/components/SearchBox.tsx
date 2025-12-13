'use client'

import { Search } from 'lucide-react'
import { Input } from '@heroui/react'

interface SearchBoxProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function SearchBox({ searchTerm, onSearchChange }: SearchBoxProps) {
  return (
    <Input
      type="text"
      placeholder="搜索导航..."
      value={searchTerm}
      onValueChange={onSearchChange}
      startContent={<Search className="text-gray-400 w-5 h-5" />}
      classNames={{
        input: "text-white placeholder-gray-400",
        inputWrapper: "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15"
      }}
      size="lg"
    />
  )
}