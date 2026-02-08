import { useState, useEffect } from 'react'

export default function AdminModal({ lesson, course, courses, onSave, onClose }) {
  const [form, setForm] = useState({
    date: '',
    title: '',
    summary: '',
    tags: '',
    notebookUrl: '',
    courseId: course.id,
  })

  useEffect(() => {
    if (lesson) {
      setForm({
        date: lesson.date,
        title: lesson.title,
        summary: lesson.summary,
        tags: lesson.tags.join(', '),
        notebookUrl: lesson.notebookUrl,
        courseId: course.id,
      })
    } else {
      setForm({
        date: new Date().toISOString().slice(0, 10),
        title: '',
        summary: '',
        tags: '',
        notebookUrl: '',
        courseId: course.id,
      })
    }
  }, [lesson, course.id])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.date) return
    onSave({
      id: lesson?.id || Date.now(),
      date: form.date,
      title: form.title.trim(),
      summary: form.summary.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      notebookUrl: form.notebookUrl.trim() || '#',
    }, form.courseId)
  }

  const selectedCourse = courses.find((c) => c.id === form.courseId) || course

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[1000] p-5 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl animate-slideUp max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900">
            {lesson ? '✏️ レッスンを編集' : '➕ 新しいレッスン'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-500 text-xl transition-colors cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course selector */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">コース</label>
            <select
              value={form.courseId}
              onChange={(e) => setForm({ ...form, courseId: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent bg-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">日付</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent font-mono"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">タイトル</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="レッスンのタイトル"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent"
              required
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">概要</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="レッスンの概要を入力..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">
              タグ <span className="text-gray-300 font-normal">（カンマ区切り）</span>
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="例: 芸術, 絵画"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent"
            />
            {form.tags && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {form.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold"
                    style={{ background: selectedCourse.accent, color: selectedCourse.color }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* NotebookLM URL */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1.5">NotebookLM URL</label>
            <input
              type="url"
              value={form.notebookUrl}
              onChange={(e) => setForm({ ...form, notebookUrl: e.target.value })}
              placeholder="https://notebooklm.google.com/notebook/..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl text-white font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer mt-2"
            style={{ background: `linear-gradient(135deg, ${selectedCourse.color}, ${selectedCourse.color}cc)` }}
          >
            {lesson ? '保存する' : '追加する'}
          </button>
        </form>
      </div>
    </div>
  )
}
