import { useState, useCallback } from 'react'

export default function WordForm({ onAdd, isLoading }) {
  const [word, setWord] = useState('')
  const [error, setError] = useState('')

  const handleChange = useCallback((e) => {
    const val = e.target.value
    setWord(val)
    if (error) setError('')
  }, [error])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = word.trim()
    if (!trimmed) {
      setError('Please enter a word')
      return
    }
    if (trimmed.length > 100) {
      setError('Word must be 100 characters or less')
      return
    }
    if (!/^[a-zA-Z\s\-']+$/.test(trimmed)) {
      setError('Only letters, spaces, hyphens, and apostrophes allowed')
      return
    }
    setError('')
    onAdd(trimmed)
    setWord('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={word}
            onChange={handleChange}
            placeholder="Enter a word (e.g. serendipity)"
            className={`w-full px-4 py-2.5 text-base rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:border-transparent ${
              error
                ? 'border-red-300 bg-red-50 focus:ring-red-500'
                : 'border-slate-200 bg-slate-50 focus:ring-indigo-500'
            }`}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !word.trim()}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-200 active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Adding
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Word
            </span>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1.5">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
    </form>
  )
}
