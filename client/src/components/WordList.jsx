import { useState } from 'react'

function formatDate(dateStr) {
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = d - now
  const isDue = diffMs <= 0

  if (isDue) return 'Due now'

  const diffMins = Math.floor(diffMs / (1000 * 60))
  if (diffMins < 60) return `In ${diffMins}m`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `In ${diffHours}h`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `In ${diffDays}d`

  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      <p className="mt-3 text-slate-400 text-sm">Loading words...</p>
    </div>
  )
}

function EmptyState({ hasSearch }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
      <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
      {hasSearch ? (
        <p className="text-lg font-medium">No words match your search</p>
      ) : (
        <>
          <p className="text-lg font-medium">Your vocabulary is empty</p>
          <p className="text-sm mt-1">Add your first word above to get started!</p>
        </>
      )}
    </div>
  )
}

export default function WordList({ words, isLoading, hasSearch }) {
  const [expandedId, setExpandedId] = useState(null)

  if (isLoading) return <Spinner />

  if (!words || words.length === 0) return <EmptyState hasSearch={hasSearch} />

  return (
    <div className="space-y-2">
      {words.map((w) => {
        const isDue = new Date(w.nextReviewAt) <= new Date()
        const isExpanded = expandedId === w._id
        return (
          <div
            key={w._id}
            className={`group rounded-xl border transition-all duration-200 ${
              isDue
                ? 'border-emerald-200 bg-emerald-50/50'
                : isExpanded
                  ? 'border-indigo-200 bg-white shadow-sm'
                  : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
            }`}
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : w._id)}
              className="w-full text-left px-5 py-3.5 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-semibold text-slate-900 capitalize truncate">{w.word}</h3>
                  {w.partOfSpeech && (
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-medium rounded uppercase tracking-wider flex-shrink-0">
                      {w.partOfSpeech}
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mt-0.5 line-clamp-1">{w.definition}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isDue ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {w.reviewCount} rev{w.reviewCount !== 1 ? 's' : ''}
                </span>
                <p className={`text-xs mt-1 ${isDue ? 'text-emerald-600 font-medium' : 'text-slate-400'}`}>
                  {formatDate(w.nextReviewAt)}
                </p>
              </div>
            </button>
            {isExpanded && (
              <div className="px-5 pb-4 pt-0 border-t border-slate-100 mt-0">
                {w.example && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Example</p>
                    <p className="text-sm text-slate-600 italic leading-relaxed">&ldquo;{w.example}&rdquo;</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
