export default function InterviewPage({ params }: { params: { sessionId: string } }) {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="font-cormorant text-4xl mb-8">Live Interview</h1>

      <div className="max-w-2xl mx-auto space-y-6">
        <div className="border-2 border-amber-200 rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🎙️</div>
          <h2 className="font-cormorant text-2xl mb-2">Record a voice interview</h2>
          <p className="text-gray-600 mb-6">Session ID: {params.sessionId}</p>

          <div className="bg-amber-50 rounded p-6 mb-6">
            <p className="text-gray-700 mb-4">Features:</p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>🎤 Push-to-talk recording</li>
              <li>🤖 AI interviewer with contextual questions</li>
              <li>📊 Real-time transcription</li>
              <li>💾 Automatic archival to Supabase</li>
            </ul>
          </div>

          <button className="px-8 py-3 bg-amber-600 text-white rounded-lg font-cormorant text-lg hover:bg-amber-700">
            Start Recording
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-cormorant text-lg mb-2">Time Elapsed</h3>
            <p className="text-3xl font-bold text-amber-600">0:00</p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-cormorant text-lg mb-2">Segments Recorded</h3>
            <p className="text-3xl font-bold text-amber-600">0</p>
          </div>
        </div>
      </div>
    </main>
  )
}
