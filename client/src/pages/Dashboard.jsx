import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import WordForm from '../components/WordForm'
import WordList from '../components/WordList'
import DevModeToggle from '../components/DevModeToggle'
import Toast from '../components/Toast'
import { useWords, useAddWord, useDevMode, useToggleDevMode, useAdvanceTime, useReviewWords } from '../hooks/useWords'

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()
  const limit = 10

  const { data: wordsData, isLoading: wordsLoading, isFetching } = useWords(search, page, limit)
  const addWordMutation = useAddWord()
  const { data: devModeData } = useDevMode()
  const toggleDevModeMutation = useToggleDevMode()
  const advanceTimeMutation = useAdvanceTime()
  const { data: reviewWords } = useReviewWords()

  const words = Array.isArray(wordsData) ? wordsData : (wordsData?.words || [])
  const totalPages = Array.isArray(wordsData) ? 1 : (wordsData?.totalPages || 1)
  const total = Array.isArray(wordsData) ? words.length : (wordsData?.total || 0)
  const dueWordCount = reviewWords?.length || 0

  const showToast = useCallback((message, type) => {
    setToast({ message, type })
  }, [])

  const handleAddWord = useCallback(async (word) => {
    try {
      await addWordMutation.mutateAsync(word)
      showToast(`Added "${word}" successfully!`, 'success')
    } catch (err) {
      showToast(err.response?.data?.error || err.message, 'error')
    }
  }, [addWordMutation, showToast])

  const handleDevMode = useCallback(async (enabled) => {
    await toggleDevModeMutation.mutateAsync(enabled)
    showToast(`Dev Mode ${enabled ? 'ON' : 'OFF'}`, 'success')
  }, [toggleDevModeMutation, showToast])

  const handleAdvance = useCallback(async () => {
    await advanceTimeMutation.mutateAsync()
    showToast('Time advanced! All words are now due.', 'success')
  }, [advanceTimeMutation, showToast])

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value)
    setPage(1)
  }, [])

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Manage your vocabulary and track your progress</p>
      </div>

      <DevModeToggle
        devMode={devModeData?.devMode || false}
        onToggle={handleDevMode}
        onAdvance={handleAdvance}
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Add a New Word</h2>
        <WordForm onAdd={handleAddWord} isLoading={addWordMutation.isPending} />
      </div>

      {dueWordCount > 0 && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-emerald-800">
                {dueWordCount} word{dueWordCount !== 1 ? 's' : ''} due for review
              </p>
              <p className="text-sm text-emerald-600">Keep up the good work!</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/review')}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all duration-200 shadow-sm shadow-emerald-200"
          >
            Start Review
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Your Words</h2>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search words..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
            />
          </div>
        </div>

        <WordList words={words} isLoading={wordsLoading || isFetching} hasSearch={!!search} />

        {totalPages > 1 && !wordsLoading && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </span>
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                    p === page
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="flex items-center gap-1">
                Next
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        )}

        {!wordsLoading && !isFetching && total > 0 && (
          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {total} word{total !== 1 ? 's' : ''} total
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
