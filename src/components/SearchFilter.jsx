import { useState } from 'react'

export default function SearchFilter({ searchQuery, setSearchQuery, allTags, selectedTag, setSelectedTag, courseColor, courseAccent }) {
  const [showTags, setShowTags] = useState(false)

  return (
    <div className="space-y-2 animate-slideIn">
      <div className="flex gap-2 items-center">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="検索..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:border-transparent transition-shadow placeholder:text-gray-300"
            style={{ '--tw-ring-color': `${courseColor}40` }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
        {/* Tag toggle */}
        <button
          onClick={() => setShowTags(!showTags)}
          className="px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex-shrink-0"
          style={{
            borderColor: showTags || selectedTag ? courseColor : '#e5e7eb',
            background: showTags || selectedTag ? courseAccent : '#fff',
            color: showTags || selectedTag ? courseColor : '#9ca3af',
          }}
        >
          🏷 タグ{selectedTag ? `: ${selectedTag}` : ''}
        </button>
      </div>

      {/* Tag list (collapsible) */}
      {showTags && (
        <div className="flex gap-1.5 flex-wrap items-center animate-slideIn">
          <button
            onClick={() => { setSelectedTag(null) }}
            className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
            style={{
              background: selectedTag === null ? courseColor : '#f3f4f6',
              color: selectedTag === null ? '#fff' : '#9ca3af',
            }}
          >
            すべて
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              style={{
                background: selectedTag === tag ? courseColor : courseAccent,
                color: selectedTag === tag ? '#fff' : courseColor,
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
