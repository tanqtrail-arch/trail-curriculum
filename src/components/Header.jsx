export default function Header({ viewMode, setViewMode, onAdminToggle, isAdmin }) {
  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-purple-500 flex items-center justify-center text-xl shadow-sm">
            🔭
          </div>
          <div>
            <h1 className="text-lg font-black text-gray-900 tracking-tight leading-tight">探究教室 TRAIL</h1>
            <p className="text-[10px] text-gray-400 font-medium tracking-widest">CURRICULUM PORTAL</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {[
              { key: 'list', label: '一覧', icon: '☰' },
              { key: 'calendar', label: 'カレンダー', icon: '📅' },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setViewMode(v.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === v.key
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="mr-1">{v.icon}</span>{v.label}
              </button>
            ))}
          </div>
          <button
            onClick={onAdminToggle}
            className={`ml-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isAdmin
                ? 'bg-violet-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
            }`}
          >
            ⚙️ 管理
          </button>
        </div>
      </div>
    </header>
  )
}
