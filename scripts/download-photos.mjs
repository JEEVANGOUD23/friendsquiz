// Downloads one photo per quiz option from Pixabay into public/options/
// Usage (from the project root):
//   PowerShell:  $env:PIXABAY_API_KEY="your-key"; node scripts/download-photos.mjs
//   Mac/Linux:   PIXABAY_API_KEY=your-key node scripts/download-photos.mjs

import { mkdir, writeFile, access } from "node:fs/promises";

const KEY = process.env.PIXABAY_API_KEY;
if (!KEY) {
  console.error(
    "Set PIXABAY_API_KEY first (log in at https://pixabay.com/api/docs/ to see your key)."
  );
  process.exit(1);
}

// file name (without .jpg)  ->  search text
const PHOTOS = {
  red: "red paint wall",
  blue: "blue ocean water",
  black: "black texture background",
  green: "green leaves",

  pizza: "pizza",
  burger: "burger",
  biryani: "chicken biryani",
  pasta: "pasta dish",

  maldives: "maldives beach",
  paris: "paris eiffel tower",
  switzerland: "switzerland alps",
  japan: "japan mount fuji",

  summer: "summer beach",
  rainy: "rain window",
  winter: "snow winter",
  spring: "cherry blossom spring",

  movies: "watching movie popcorn",
  gaming: "video game controller",
  "listening-music": "headphones music",
  travelling: "airplane window travel",

  coffee: "coffee cup",
  "bubble-tea": "bubble tea",
  juice: "fresh orange juice",
  tea: "cup of tea",

  friends: "friends laughing together",
  family: "happy family",
  gifts: "gift boxes",
  adventures: "hiking adventure mountain",

  rock: "electric guitar",
  pop: "concert stage lights",
  hiphop: "hip hop dance",
  melody: "piano keys",

  "staying-home": "cozy living room couch",
  party: "party confetti",
  "going-out": "city night walk",
  sleeping: "sleeping in bed",

  morning: "sunrise morning",
  afternoon: "sunny afternoon sky",
  evening: "sunset evening",
  night: "night sky stars",
};

const OUT_DIR = "public/options";
await mkdir(OUT_DIR, { recursive: true });

const exists = (path) => access(path).then(() => true, () => false);
const sleep = (seconds) => new Promise((r) => setTimeout(r, seconds * 1000));

// Pixabay sometimes answers 429 (too many requests). Wait and try again.
async function download(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url);
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status !== 429) throw new Error(`download failed (${res.status})`);

    const wait = attempt * 15;
    console.log(`       rate limited, waiting ${wait}s then retrying...`);
    await sleep(wait);
  }
  throw new Error("download failed (429) after 5 tries");
}

for (const [name, query] of Object.entries(PHOTOS)) {
  const file = `${OUT_DIR}/${name}.jpg`;

  if (await exists(file)) {
    console.log(`skip   ${name} (already exists)`);
    continue;
  }

  try {
    const url =
      `https://pixabay.com/api/?key=${KEY}` +
      `&q=${encodeURIComponent(query)}` +
      `&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;

    const search = await fetch(url);
    if (!search.ok) throw new Error(`search failed (${search.status})`);

    const data = await search.json();
    const photo = data.hits?.[0];
    if (!photo) throw new Error("no results");

    // 640px wide: good quality for the quiz cards, small file size
    await writeFile(file, await download(photo.webformatURL));
    console.log(`saved  ${name}  <-  "${query}"  (by ${photo.user})`);
  } catch (error) {
    console.log(`FAILED ${name}: ${error.message}`);
  }

  await sleep(3);
}

console.log("\nDone. Open public/options/ and swap any photo you don't like.");
