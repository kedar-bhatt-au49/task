import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewCard from '../components/ReviewCard'
import Toast from '../components/Toast'
import { useReviewWords, useReviewWord } from '../hooks/useWords'

export default function Review() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [toast, setToast] = useState(null)
  const navigate = useNavigate()

  const { data: words, isLoading: wordsLoading } = useReviewWords()
  const reviewMutation = useReviewWord()

  const showToast = useCallback((message, type) => {
    setToast({ message, type })
  }, [])

  const handleReview = useCallback(async (gotItRight) => {
    if (!words || currentIndex >= words.length) return
    try {
      const word = words[currentIndex]
      await reviewMutation.mutateAsync({ id: word._id, gotItRight })
      showToast(
        gotItRight ? 'Got it! Next review in 3 days' : 'Marked for review tomorrow',
        'success'
      )
      setCurrentIndex((prev) => prev + 1)
    } catch (err) {
      showToast(err.response?.data?.error || 'Review failed', 'error')
    }
  }, [words, currentIndex, reviewMutation, showToast])

  useEffect(() => {
    setCurrentIndex(0)
  }, [words])

  if (wordsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Loading review words...</p>
      </div>
    )
  }

  if (!words || words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">All caught up!</h2>
        <p className="text-slate-500 mb-8">No words due for review right now.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-[0.98]"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  if (currentIndex >= words.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review Complete!</h2>
        <p className="text-slate-500 mb-8">You reviewed all {words.length} word{words.length !== 1 ? 's' : ''}.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-[0.98]"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  const currentWord = words[currentIndex]

  return (
    <div className="max-w-lg mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Dashboard
        </button>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {words.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentIndex ? 'bg-indigo-600 scale-125' : i < currentIndex ? 'bg-emerald-400' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-400 font-medium ml-2">
            {currentIndex + 1}/{words.length}
          </span>
        </div>
      </div>

      <ReviewCard
        word={currentWord}
        onReview={handleReview}
        isLoading={reviewMutation.isPending}
      />
    </div>
  )
}
