export default function LessonModal({ lesson, course, onClose }) {
  if (!lesson) return null
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-slideUp"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-xs px-3 py-1 rounded-full font-bold"
            style={{ background: course.accent, color: course.color }}
          >
            {course.icon} {course.name}
          </span>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 text-xl transition-colors cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {/* Date */}
        <p className="text-xs text-gray-400 font-mono mb-1">
          {lesson.date.replace(/-/g, '.')}
        </p>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-900 leading-snug mb-4">
          {lesson.title}
        </h2>

        {/* Tags */}
        <div className="flex gap-1.5 flex-wrap mb-4">
          {lesson.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: course.accent, color: course.color }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-5">
          <p className="text-sm text-gray-600 leading-loose">{lesson.summary}</p>
        </div>

        {/* NotebookLM link */}
        <a
          href={lesson.notebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}cc)` }}
        >
          📓 NotebookLM で詳しく見る
        </a>
      </div>
    </div>
  )
}
