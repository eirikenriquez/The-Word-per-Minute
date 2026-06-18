import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = new URL("../", import.meta.url);
const bibleDataBaseUrl = "https://raw.githubusercontent.com/midvash/bible-data/main";
const githubApiBaseUrl = "https://api.github.com/repos/midvash/bible-data/contents";
const outputRoot = new URL("../src/data/bibles/", import.meta.url);

const bookOrder = [
  "Gen",
  "Exod",
  "Lev",
  "Num",
  "Deut",
  "Josh",
  "Judg",
  "Ruth",
  "1Sam",
  "2Sam",
  "1Kgs",
  "2Kgs",
  "1Chr",
  "2Chr",
  "Ezra",
  "Neh",
  "Esth",
  "Job",
  "Ps",
  "Prov",
  "Eccl",
  "Song",
  "Isa",
  "Jer",
  "Lam",
  "Ezek",
  "Dan",
  "Hos",
  "Joel",
  "Amos",
  "Obad",
  "Jonah",
  "Mic",
  "Nah",
  "Hab",
  "Zeph",
  "Hag",
  "Zech",
  "Mal",
  "Matt",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Rom",
  "1Cor",
  "2Cor",
  "Gal",
  "Eph",
  "Phil",
  "Col",
  "1Thess",
  "2Thess",
  "1Tim",
  "2Tim",
  "Titus",
  "Phlm",
  "Heb",
  "Jas",
  "1Pet",
  "2Pet",
  "1John",
  "2John",
  "3John",
  "Jude",
  "Rev",
];

const translationsToImport = [
  {
    id: "web",
    path: "versions/en/web",
  },
];

async function main() {
  await mkdir(outputRoot, { recursive: true });

  const translations = [];

  for (const translationToImport of translationsToImport) {
    const importedTranslation = await importTranslation(translationToImport);
    translations.push(importedTranslation);
  }

  await writeJson(new URL("./src/data/translations.json", repoRoot), { translations });
}

async function importTranslation({ id, path: upstreamPath }) {
  const metadata = await fetchJson(`${bibleDataBaseUrl}/${upstreamPath}/metadata.json`);
  const bookItems = await fetchJson(`${githubApiBaseUrl}/${upstreamPath}/books?ref=main`);
  const bookByName = new Map(bookItems.map((item) => [item.name.replace(".json", ""), item]));
  const translationRoot = new URL(`./${id}/`, outputRoot);
  const booksRoot = new URL("./books/", translationRoot);

  await rm(translationRoot, { recursive: true, force: true });
  await mkdir(booksRoot, { recursive: true });

  const books = [];

  for (const bookId of bookOrder) {
    const bookItem = bookByName.get(bookId);
    if (!bookItem) {
      throw new Error(`Missing ${bookId}.json for ${id}`);
    }

    const upstreamBook = await fetchJson(bookItem.download_url);
    const book = normalizeBook(id, bookId, upstreamBook);
    books.push({
      id: book.id,
      name: book.name,
      testament: book.testament,
      chapterCount: book.chapters.length,
      verseCounts: book.chapters.map((chapter) => chapter.verses.length),
    });

    await writeJson(new URL(`./${book.id}.json`, booksRoot), book);
  }

  await writeJson(new URL("./manifest.json", translationRoot), {
    translationId: id,
    books,
  });

  return {
    id,
    name: metadata.name,
    abbreviation: metadata.shortName,
    language: metadata.language,
    license: metadata.license,
    source: "Midvash bible-data",
    sourceUrl: metadata.sourceUrl,
  };
}

function normalizeBook(translationId, bookId, upstreamBook) {
  return {
    translationId,
    id: bookId,
    name: upstreamBook.englishName ?? upstreamBook.book,
    testament: upstreamBook.testament,
    chapters: upstreamBook.chapters.map((chapter) => ({
      chapter: chapter.chapter,
      verses: chapter.verses.map((verse) => ({
        number: verse.number,
        text: verse.text,
      })),
    })),
  };
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "the-word-per-minute",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function writeJson(fileUrl, data) {
  const filePath = fileURLToPath(fileUrl);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
