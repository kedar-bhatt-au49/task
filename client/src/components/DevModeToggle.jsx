export default function DevModeToggle({ devMode, onToggle, onAdvance }) {
  return (
    <div className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
      devMode
        ? 'bg-amber-50 border-amber-200 shadow-sm shadow-amber-100'
        : 'bg-white border-slate-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
            devMode ? 'bg-amber-100' : 'bg-slate-100'
          }`}>
            <svg className={`w-5 h-5 transition-colors duration-300 ${
              devMode ? 'text-amber-600' : 'text-slate-400'
            }`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h3 className={`font-semibold transition-colors duration-300 ${
              devMode ? 'text-amber-900' : 'text-slate-700'
            }`}>Dev Mode</h3>
            <p className={`text-sm transition-colors duration-300 ${
              devMode ? 'text-amber-700' : 'text-slate-400'
            }`}>
              {devMode ? 'Review intervals in minutes (3m / 1m)' : 'Review intervals in days (3d / 1d)'}
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
          <input
            type="checkbox"
            checked={devMode}
            onChange={() => onToggle(!devMode)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-500 peer-checked:to-orange-500"></div>
        </label>
      </div>
      {devMode && (
        <button
          onClick={onAdvance}
          className="mt-3 w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-sm shadow-amber-200 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Advance Time (make all words due now)
          </span>
        </button>
      )}
    </div>
  )
}
