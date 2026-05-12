export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <h1 className="font-cormorant text-4xl mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 gap-8">
        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="font-cormorant text-2xl mb-4">Life Coverage</h2>
          <div className="flex items-center justify-center h-64 bg-amber-50">
            <div className="text-center">
              <div className="text-5xl font-bold text-amber-600">11</div>
              <p className="text-gray-600">life topics</p>
              <p className="text-sm text-gray-500 mt-2">childhood, family, work, loss, joy, travel, home, faith, friendship, legacy, other</p>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="font-cormorant text-2xl mb-4">Memory Timeline</h2>
          <div className="flex items-center justify-center h-64 bg-amber-50">
            <p className="text-gray-500">Dates from 1920s to 1990s</p>
          </div>
        </div>

        <div className="col-span-2 border border-gray-200 rounded-lg p-6">
          <h2 className="font-cormorant text-2xl mb-4">Family Tree</h2>
          <div className="grid grid-cols-4 gap-4">
            {['Mother', 'Father', 'Sister', 'Spouse', 'Friends', 'Colleagues'].map((name) => (
              <div key={name} className="p-4 bg-amber-50 rounded text-center">
                <p className="font-cormorant text-lg">{name}</p>
                <p className="text-sm text-gray-500">Mentioned in memories</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
