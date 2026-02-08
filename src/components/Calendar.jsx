const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const MONTH_NAMES = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay()
}

function formatDate(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Calendar({ year, month, lessons, course, onLessonClick, onMonthChange }) {
  const days = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)

  const lessonsByDate = {}
  lessons.forEach((l) => {
    if (!lessonsByDate[l.date]) lessonsByDate[l.date] = []
    lessonsByDate[l.date].push(l)
  })

  const today = new Date()
  const isToday = (d) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onMonthChange(-1)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          ←
        </button>
        <h3 className="text-lg font-bold text-gray-900">
          {year}年 {MONTH_NAMES[month]}
        </h3>
        <button
          onClick={() => onMonthChange(1)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          →
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`text-center text-xs font-bold py-2 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-gray-400'
            }`}
          >
            {w}
          </div>
        ))}

        {/* Day cells */}
        {cells.map((d, i) => {
          const dateStr = d ? formatDate(year, month, d) : null
          const dayLessons = dateStr ? lessonsByDate[dateStr] : null
          const hasLesson = dayLessons && dayLessons.length > 0
          return (
            <div
              key={i}
              onClick={() => hasLesson && onLessonClick(dayLessons[0])}
              className={`aspect-square flex flex-col items-center justify-center rounded-xl transition-all ${
                hasLesson
                  ? 'cursor-pointer hover:scale-105'
                  : isToday(d)
                    ? 'bg-gray-50'
                    : ''
              }`}
              style={{
                background: hasLesson ? course.accent : undefined,
                border: hasLesson
                  ? `2px solid ${course.color}40`
                  : isToday(d)
                    ? '2px solid #e5e7eb'
                    : '2px solid transparent',
              }}
            >
              {d && (
                <>
                  <span
                    className="text-xs font-mono"
                    style={{
                      fontWeight: hasLesson ? 800 : 500,
                      color: hasLesson ? course.color : isToday(d) ? '#1f2937' : '#9ca3af',
                    }}
                  >
                    {d}
                  </span>
                  {hasLesson && (
                    <div className="flex gap-0.5 mt-1">
                      {dayLessons.map((_, idx) => (
                        <div
                          key={idx}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: course.color }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* Lesson list below calendar */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        {lessons
          .filter((l) => l.date.startsWith(formatDate(year, month, 1).slice(0, 7)))
          .map((l) => (
            <button
              key={l.id}
              onClick={() => onLessonClick(l)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 hover:scale-[1.03] transition-transform cursor-pointer"
              style={{ background: course.accent }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: course.color }} />
              {l.date.split('-')[2]}日 - {l.title}
            </button>
          ))}
      </div>
    </div>
  )
}
