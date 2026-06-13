import { useEffect } from 'react'

const icons = {
  success: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const colors = {
  success: 'from-emerald-500 to-green-600 shadow-emerald-200',
  error: 'from-red-500 to-rose-600 shadow-red-200',
}

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const gradient = colors[type] || 'from-blue-500 to-indigo-600 shadow-blue-200'

  return (
    <div
      className={`fixed top-5 right-5 z-50 bg-gradient-to-r ${gradient} text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-3 animate-[slideIn_0.3s_ease-out] max-w-sm`}
    >
      <span className="flex-shrink-0">{icons[type]}</span>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white transition-colors flex-shrink-0">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
