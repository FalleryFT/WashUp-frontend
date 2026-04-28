// src/components/AuthLayout.jsx
const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#dff0f7] flex items-center justify-center p-4">
      {/* Card container */}
      <div className="relative flex w-full max-w-3xl min-h-[520px]">
        {/* Left panel - logo */}
        <div className="w-[46%] bg-[#7ecfe0] rounded-3xl flex items-center justify-center shadow-lg z-10">
          <div className="flex items-center justify-center w-52 h-52">
            {/* SVG Logo placeholder - biru dengan motif S */}
            <svg viewBox="0 0 200 200" className="w-48 h-48 drop-shadow-xl">
              <defs>
                <radialGradient id="bg" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#4baed4" />
                  <stop offset="100%" stopColor="#1a5fa8" />
                </radialGradient>
                <radialGradient id="inner" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#5bbfe8" />
                  <stop offset="100%" stopColor="#1752a0" />
                </radialGradient>
              </defs>
              <circle cx="100" cy="100" r="96" fill="url(#bg)" />
              <circle cx="100" cy="100" r="88" fill="url(#inner)" opacity="0.7" />
              {/* S shape */}
              <path
                d="M130 65 Q145 75 135 95 Q125 110 100 115 Q75 120 68 138 Q62 155 80 165 Q95 172 115 165"
                fill="none" stroke="white" strokeWidth="14" strokeLinecap="round"
              />
              <path
                d="M72 68 Q90 58 110 68 Q128 78 125 95"
                fill="none" stroke="white" strokeWidth="13" strokeLinecap="round" opacity="0.85"
              />
              {/* dots */}
              <circle cx="78" cy="108" r="5" fill="white" opacity="0.9" />
              <circle cx="92" cy="118" r="4" fill="white" opacity="0.75" />
              <circle cx="108" cy="125" r="5.5" fill="white" opacity="0.9" />
              {/* waves */}
              <path d="M68 148 Q78 143 88 148 Q98 153 108 148" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
              <path d="M72 158 Q82 153 92 158 Q102 163 112 158" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" />
            </svg>
          </div>
        </div>

        {/* Right panel - form */}
        <div className="flex-1 bg-white rounded-3xl shadow-xl ml-[-30px] z-20 flex flex-col justify-center px-10 py-10">
          {children}
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-5 right-6 w-9 h-9 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition"
      >
        ←
      </button>
    </div>
  );
};

export default AuthLayout;
