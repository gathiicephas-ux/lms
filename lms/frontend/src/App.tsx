import { BrowserRouter, Routes, Route } from 'react-router-dom'

export default function App() {
  return (
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <Routes>
            <Route path="/" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    Corporate Authority Programme™
                  </h1>
                  <p className="text-xl text-slate-300 mb-8">
                    The Cephas Effect LMS
                  </p>
                  <div className="space-y-4">
                    <a href="/login" className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition">
                      Login
                    </a>
                    <p className="text-slate-400">
                      LMS is loading...
                    </p>
                  </div>
                </div>
              </div>
            } />
            <Route path="/login" element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md">
                  <h2 className="text-2xl font-bold text-white mb-6">Login</h2>
                  <p className="text-slate-300">
                    Login functionality coming soon...
                  </p>
                </div>
              </div>
            } />
          </Routes>
        </div>
      </BrowserRouter>
    )
}
