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
    <div>
      <header>
        <h1>The Word per Minute</h1>
      </header>
      <main>
        {!verses && !err && <div>Loading verses…</div>}
        {err && <div>{err}</div>}
        {verses && (
          <div>
            <p>{verses[0].ref}</p>
            <p>{verses[0].text}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
