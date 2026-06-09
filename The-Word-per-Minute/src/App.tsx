import versesData from "./data/verses.json";
import type { Verse } from "./types/verse";

function App() {
  const verses = versesData.verses as Verse[];
  const firstVerse = verses[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-xl font-bold">The Word per Minute</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {firstVerse ? (
          <div className="rounded-2xl bg-white p-5 border shadow-sm">
            <p className="text-sm text-slate-500 mb-2">{firstVerse.ref}</p>
            <p className="leading-8">{firstVerse.text}</p>
          </div>
        ) : (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            No verses found.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
