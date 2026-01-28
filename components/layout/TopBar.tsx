/**
 * Top bar header with green background, greeting, and user profile.
 * Matches the FOBOH design with centered rounded banner style.
 */
"use client";


export function TopBar() {
  return (
    <div className="sticky top-0 z-50">
      <header className="flex items-center justify-between bg-[#147D64] px-6 py-3">
        {/* Left: Greeting */}
        <div className="text-white">
          <div className="text-sm font-semibold">Hello, Ekemini</div>
          <div className="text-xs text-emerald-100/80">Tue, 13 February 2024</div>
        </div>

        {/* Right: Notifications and Profile */}
        <div className="flex items-center gap-4">
          {/* Notification icons */}
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-100">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 hover:bg-slate-100">
              <div className="flex h-4 w-4 items-center justify-center rounded-full border border-slate-600">
                <span className="text-xs font-semibold">?</span>
              </div>
            </button>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="text-white">
              <div className="text-sm font-medium">Ekemini Mark</div>
              <div className="text-xs text-emerald-100/80">Happy Normal</div>
            </div>
            {/* Avatar - checkered pattern like in design */}
            <div className="h-9 w-9 overflow-hidden rounded-full bg-white">
              <div className="grid h-full w-full grid-cols-4 grid-rows-4">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      (Math.floor(i / 4) + (i % 4)) % 2 === 0
                        ? "bg-slate-800"
                        : "bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>
            {/* Chevron down */}
            <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </header>
    </div>
  );
}
