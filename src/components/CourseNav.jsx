export default function CourseNav({ courses, activeCourse, setActiveCourse }) {
  return (
    <div className="bg-white border-b border-gray-100 overflow-x-auto">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 flex gap-1">
        {courses.map((c) => {
          const isActive = activeCourse === c.id
          return (
            <button
              key={c.id}
              onClick={() => setActiveCourse(c.id)}
              className="group relative px-4 py-3 border-b-[3px] transition-all whitespace-nowrap cursor-pointer"
              style={{
                borderBottomColor: isActive ? c.color : 'transparent',
                color: isActive ? c.color : '#9ca3af',
              }}
            >
              <span className="text-sm font-bold group-hover:opacity-80">
                <span className="mr-1.5">{c.icon}</span>
                {c.name}
              </span>
              <span
                className="block text-[10px] font-medium mt-0.5 transition-colors"
                style={{ color: isActive ? `${c.color}99` : '#d1d5db' }}
              >
                {c.target}
                <span className="ml-1">/ {c.day}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
