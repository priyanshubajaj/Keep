export default function HomePage() {
  return (
    <main className="min-h-screen bg-sepia">
      <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        <h1 className="font-cormorant text-6xl font-semibold text-amber-900 mb-6">Keep</h1>
        <p className="font-cormorant text-2xl text-amber-800 mb-8">Preserve family voices with AI</p>

        <p className="text-lg text-gray-700 max-w-2xl text-center mb-12 leading-relaxed">
          Turn written memoirs and voice recordings into personalized AI that remembers the people you love.
          Indexed, searchable, and speaking in their own voice.
        </p>

        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
          <a
            href="/interview/demo"
            className="px-8 py-4 bg-amber-600 text-white rounded-lg font-cormorant text-lg text-center hover:bg-amber-700 transition"
          >
            Start Interview
          </a>
          <a
            href="/dashboard"
            className="px-8 py-4 bg-gray-300 text-gray-900 rounded-lg font-cormorant text-lg text-center hover:bg-gray-400 transition"
          >
            View Dashboard
          </a>
        </div>

        <div className="mt-20 border-t border-amber-300 pt-12 max-w-2xl">
          <h2 className="font-cormorant text-2xl text-amber-900 mb-6">How it works</h2>
          <ol className="space-y-4 text-gray-700">
            <li className="flex gap-4">
              <span className="font-cormorant text-2xl font-bold text-amber-600">1</span>
              <p>Provide a written memoir or voice recordings</p>
            </li>
            <li className="flex gap-4">
              <span className="font-cormorant text-2xl font-bold text-amber-600">2</span>
              <p>AI segments, extracts entities, and builds a persona</p>
            </li>
            <li className="flex gap-4">
              <span className="font-cormorant text-2xl font-bold text-amber-600">3</span>
              <p>Voice is cloned and responses are pre-computed</p>
            </li>
            <li className="flex gap-4">
              <span className="font-cormorant text-2xl font-bold text-amber-600">4</span>
              <p>Ask questions and hear their voice answer from memory</p>
            </li>
          </ol>
        </div>
      </div>
    </main>
  )
}
