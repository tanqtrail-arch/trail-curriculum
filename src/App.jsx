import { useState, useEffect, useMemo } from 'react'
import coursesData from './data/courses.json'
import lessonsData from './data/lessons.json'
import Header from './components/Header'
import CourseNav from './components/CourseNav'
import CourseHeader from './components/CourseHeader'
import SearchFilter from './components/SearchFilter'
import LessonCard from './components/LessonCard'
import LessonModal from './components/LessonModal'
import Calendar from './components/Calendar'
import AdminModal from './components/AdminModal'

const ALL_COURSE = {
  id: 'all',
  name: '全クラス',
  target: '全学年',
  day: '全曜日',
  color: '#495057',
  accent: '#F1F3F5',
  icon: '📋',
  description: '全コースの授業を新着順で表示',
}

function App() {
  const [activeCourse, setActiveCourse] = useState('all')
  const [viewMode, setViewMode] = useState('calendar')
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [calYear, setCalYear] = useState(2026)
  const [calMonth, setCalMonth] = useState(0)
  const [openMonths, setOpenMonths] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLesson, setAdminLesson] = useState(undefined)
  const [lessons, setLessons] = useState(lessonsData)

  const isAll = activeCourse === 'all'
  const course = isAll ? ALL_COURSE : coursesData.find((c) => c.id === activeCourse)

  // Build lessons with courseId attached
  const courseLessons = useMemo(() => {
    if (isAll) {
      const all = []
      for (const [courseId, items] of Object.entries(lessons)) {
        items.forEach((l) => all.push({ ...l, courseId }))
      }
      // newest first
      all.sort((a, b) => b.date.localeCompare(a.date))
      return all
    }
    return (lessons[activeCourse] || []).map((l) => ({ ...l, courseId: activeCourse }))
  }, [lessons, activeCourse, isAll])

  // Helper: get course object by id
  const getCourse = (courseId) => coursesData.find((c) => c.id === courseId) || ALL_COURSE

  // Collect all unique tags for current view
  const allTags = useMemo(() => {
    const tags = new Set()
    courseLessons.forEach((l) => l.tags.forEach((t) => tags.add(t)))
    return [...tags]
  }, [courseLessons])

  // Filtered lessons
  const filteredLessons = useMemo(() => {
    let result = courseLessons
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.summary.toLowerCase().includes(q) ||
          l.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (selectedTag) {
      result = result.filter((l) => l.tags.includes(selectedTag))
    }
    return result
  }, [courseLessons, searchQuery, selectedTag])

  // Group by month (newest first for 'all')
  const lessonsByMonth = useMemo(() => {
    const grouped = {}
    filteredLessons.forEach((l) => {
      const key = l.date.slice(0, 7)
      if (!grouped[key]) grouped[key] = []
      grouped[key].push(l)
    })
    return grouped
  }, [filteredLessons])
  const monthKeys = Object.keys(lessonsByMonth).sort((a, b) => isAll ? b.localeCompare(a) : a.localeCompare(b))

  // Reset state on course change
  useEffect(() => {
    setOpenMonths({})
    setSearchQuery('')
    setSelectedTag(null)
  }, [activeCourse])

  const toggleMonth = (key) => {
    setOpenMonths((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleMonthChange = (dir) => {
    let newMonth = calMonth + dir
    let newYear = calYear
    if (newMonth > 11) { newMonth = 0; newYear++ }
    if (newMonth < 0) { newMonth = 11; newYear-- }
    setCalMonth(newMonth)
    setCalYear(newYear)
  }

  // Admin operations
  const handleSaveLesson = (lessonData, courseId) => {
    setLessons((prev) => {
      const updated = { ...prev }
      const cl = [...(updated[courseId] || [])]
      const existingIdx = cl.findIndex((l) => l.id === lessonData.id)
      if (existingIdx >= 0) {
        if (courseId !== (adminLesson?.courseId || activeCourse) && adminLesson) {
          const oldCourseId = adminLesson.courseId || activeCourse
          updated[oldCourseId] = (updated[oldCourseId] || []).filter((l) => l.id !== lessonData.id)
        }
        cl[existingIdx] = lessonData
      } else {
        cl.push(lessonData)
      }
      cl.sort((a, b) => a.date.localeCompare(b.date))
      updated[courseId] = cl
      return updated
    })
    setAdminLesson(undefined)
  }

  const handleDeleteLesson = (lessonId, courseId) => {
    if (!confirm('このレッスンを削除しますか？')) return
    const targetCourse = courseId || activeCourse
    setLessons((prev) => {
      const updated = { ...prev }
      updated[targetCourse] = (updated[targetCourse] || []).filter((l) => l.id !== lessonId)
      return updated
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAdminToggle={() => setIsAdmin(!isAdmin)}
        isAdmin={isAdmin}
      />
      <CourseNav
        courses={coursesData}
        activeCourse={activeCourse}
        setActiveCourse={setActiveCourse}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <CourseHeader course={course} lessonCount={courseLessons.length} />

        <SearchFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          allTags={allTags}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          courseColor={course.color}
          courseAccent={course.accent}
        />

        {isAdmin && (
          <button
            onClick={() => setAdminLesson(null)}
            className="w-full py-3 rounded-2xl border-2 border-dashed border-gray-200 text-sm font-bold text-gray-400 hover:border-violet-300 hover:text-violet-500 hover:bg-violet-50/50 transition-all cursor-pointer"
          >
            ➕ 新しいレッスンを追加
          </button>
        )}

        {/* Content */}
        {viewMode === 'list' ? (
          <div className="space-y-3 animate-slideIn">
            {monthKeys.length === 0 ? (
              <div className="text-center py-16 text-gray-300">
                {searchQuery || selectedTag
                  ? '🔍 条件に一致するレッスンが見つかりません'
                  : 'まだ授業が登録されていません'}
              </div>
            ) : (
              monthKeys.map((monthKey) => {
                const monthLessons = lessonsByMonth[monthKey]
                const isOpen = !!openMonths[monthKey]
                const [y, m] = monthKey.split('-')
                const monthLabel = `${y}年 ${parseInt(m)}月`
                return (
                  <div key={monthKey} className="animate-slideIn">
                    <button
                      onClick={() => toggleMonth(monthKey)}
                      className="w-full flex items-center justify-between px-5 py-3.5 border transition-all cursor-pointer"
                      style={{
                        background: isOpen
                          ? isAll ? 'linear-gradient(135deg, #49505706, #F1F3F580)' : `linear-gradient(135deg, ${course.color}06, ${course.accent}80)`
                          : '#fff',
                        borderColor: isOpen ? (isAll ? '#49505730' : `${course.color}30`) : '#f3f4f6',
                        borderRadius: isOpen ? '16px 16px 0 0' : '16px',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="text-lg font-black"
                          style={{ color: isOpen ? (isAll ? '#495057' : course.color) : '#1f2937' }}
                        >
                          {monthLabel}
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-0.5 rounded-full transition-all"
                          style={{
                            background: isOpen ? (isAll ? '#495057' : course.color) : '#f3f4f6',
                            color: isOpen ? '#fff' : '#9ca3af',
                          }}
                        >
                          {monthLessons.length}回
                        </span>
                      </div>
                      <span
                        className="text-sm transition-transform duration-200 inline-block"
                        style={{
                          color: isOpen ? (isAll ? '#495057' : course.color) : '#d1d5db',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        className="border border-t-0 rounded-b-2xl bg-white p-3 space-y-2.5 animate-slideIn"
                        style={{ borderColor: isAll ? '#49505720' : `${course.color}20` }}
                      >
                        {monthLessons.map((lesson) => {
                          const lessonCourse = isAll ? getCourse(lesson.courseId) : course
                          return (
                            <LessonCard
                              key={lesson.id}
                              lesson={lesson}
                              course={lessonCourse}
                              onClick={() => setSelectedLesson(lesson)}
                              onEdit={(l) => setAdminLesson(l)}
                              onDelete={(id) => handleDeleteLesson(id, lesson.courseId)}
                              isAdmin={isAdmin}
                              showCourseBadge={isAll}
                            />
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 animate-slideIn">
            <Calendar
              year={calYear}
              month={calMonth}
              lessons={courseLessons}
              course={course}
              courses={coursesData}
              isAll={isAll}
              getCourse={getCourse}
              onLessonClick={setSelectedLesson}
              onMonthChange={handleMonthChange}
            />
          </div>
        )}
      </div>

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          course={isAll ? getCourse(selectedLesson.courseId) : course}
          onClose={() => setSelectedLesson(null)}
        />
      )}

      {adminLesson !== undefined && (
        <AdminModal
          lesson={adminLesson}
          course={isAll ? (adminLesson ? getCourse(adminLesson.courseId) : coursesData[0]) : course}
          courses={coursesData}
          onSave={handleSaveLesson}
          onClose={() => setAdminLesson(undefined)}
        />
      )}
    </div>
  )
}

export default App
