export default function LessonCard({ lesson, course, onClick, onEdit, onDelete, isAdmin }) {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl p-5 cursor-pointer border transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: course.accent,
        borderLeftWidth: 4,
        borderLeftColor: course.color,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 8px 24px ${course.color}15`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-400 font-mono">{lesson.date.replace(/-/g, '.')}</span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
              style={{ background: course.accent, color: course.color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <h3 className="text-base font-bold text-gray-900 leading-snug mb-1.5">{lesson.title}</h3>
      <p className="text-[13px] text-gray-500 leading-relaxed">{lesson.summary}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs font-semibold tracking-wide" style={{ color: course.color }}>
          NotebookLM で詳しく見る →
        </span>
        {isAdmin && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(lesson); }}
              className="px-2 py-1 text-[10px] rounded-md bg-blue-50 text-blue-500 hover:bg-blue-100 font-semibold cursor-pointer"
            >
              編集
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(lesson.id); }}
              className="px-2 py-1 text-[10px] rounded-md bg-red-50 text-red-500 hover:bg-red-100 font-semibold cursor-pointer"
            >
              削除
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
