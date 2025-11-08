import { useState, useEffect } from "react";

type Verse = { id: string; ref: string; text: string };

function App() {
  const [verses, setVerses] = useState<Verse[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("./data/verses.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load verses.json");
        return response.json();
      })
      .then((json) => setVerses(json.verses as Verse[]))
      .catch((error) => setErr(error.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-3xl px-4 py-4">
          <h1 className="text-xl font-bold">The Word per Minute</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 space-y-4">
        {!verses && !err && (
          <div className="rounded-xl bg-white p-4 border shadow-sm text-slate-600">
            Loading verses…
          </div>
        )}

        {err && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            {err}
          </div>
        )}

        {verses && (
          <div className="rounded-2xl bg-white p-5 border shadow-sm">
            <p className="text-sm text-slate-500 mb-2">{verses[0].ref}</p>
            <p className="leading-8">{verses[0].text}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
