import { useState } from 'react'

export default function ReviewCard({ word, onReview, isLoading }) {
  const [revealed, setRevealed] = useState(false)

  if (!word) return null

  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 p-6 sm:p-8 transition-all duration-300">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Word</p>
        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 capitalize mb-2">{word.word}</h2>
        {word.partOfSpeech && (
          <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">
            {word.partOfSpeech}
          </span>
        )}

        {revealed && (
          <div className="space-y-6 mt-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">Definition</p>
              <p className="text-slate-700 text-lg leading-relaxed">{word.definition}</p>
            </div>
            {word.example && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Example</p>
                <p className="text-slate-600 italic leading-relaxed">&ldquo;{word.example}&rdquo;</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center">
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md shadow-indigo-200 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Reveal Definition
            </span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => onReview(false)}
              disabled={isLoading}
              className="flex-1 py-3 bg-white border-2 border-amber-200 text-amber-700 font-semibold rounded-xl hover:bg-amber-50 hover:border-amber-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {isLoading ? 'Processing...' : 'Needs Work'}
            </button>
            <button
              onClick={() => onReview(true)}
              disabled={isLoading}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-emerald-200 active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving
                </span>
              ) : (
                'Got It Right'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
