interface FilterTagProps {
  tag: string
  isActive: boolean
  onClick: () => void
}

export function FilterTag({ tag, isActive, onClick }: FilterTagProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive
          ? 'bg-purple-600 text-white shadow-lg'
          : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
      }`}
    >
      {tag}
    </button>
  )
}