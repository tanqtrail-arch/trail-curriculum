export default function CourseHeader({ course, lessonCount }) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 border animate-slideIn"
      style={{
        background: `linear-gradient(135deg, ${course.color}08, ${course.accent})`,
        borderColor: `${course.color}20`,
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color}bb)` }}
      >
        {course.icon}
      </div>
      <div className="min-w-0">
        <h2 className="text-xl font-black text-gray-900 flex items-center gap-3 flex-wrap">
          {course.name}
          <span className="text-xs font-medium text-gray-400">
            {course.target}　📅 毎週{course.day}
          </span>
        </h2>
        <p className="text-sm text-gray-500 mt-0.5">{course.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: course.accent, color: course.color }}
          >
            全{lessonCount}回
          </span>
        </div>
      </div>
    </div>
  )
}
