const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const path = require("path");

const BASE_URL = "https://vedabase.io/en/library/bg";
const OUTPUT_PATH = path.join(__dirname, "src", "data", "gita.json");

const saveResults = (results) => {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2), "utf8");
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractCleanText = ($, selectors) => {
  for (const selector of selectors) {
    const text = $(selector)
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(Boolean)
      .join("\n")
      .trim();

    if (text) {
      return text;
    }
  }

  return "";
};

const scrapeVerse = async (chapter, verse) => {
  const verseRef = String(verse);
  const url = `${BASE_URL}/${chapter}/${verseRef}/`;

  try {
    const { data } = await axios.get(url, {
      timeout: 20000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; KrishnaMercyBot/1.0)",
      },
    });

    const $ = cheerio.load(data);

    const translation = extractCleanText($, [
      ".translation",
      "#translation",
      "div[class*='translation']",
    ]);

    const purport = extractCleanText($, [
      ".purport",
      "#purport",
      "div[class*='purport']",
    ]);

    if (!translation) {
      return null;
    }

    return {
      chapter,
      verse: verseRef,
      text: translation,
      purport,
      sourceUrl: url,
    };
  } catch (error) {
    console.log(`Error at ${chapter}-${verseRef}: ${error.message}`);
    return null;
  }
};

const parseVerseStart = (verseRef) => {
  const firstPart = String(verseRef).split("-")[0];
  const numeric = Number(firstPart);
  return Number.isFinite(numeric) ? numeric : Number.MAX_SAFE_INTEGER;
};

const getChapterVerseRefs = async (chapter) => {
  const chapterUrl = `${BASE_URL}/${chapter}/`;
  const { data } = await axios.get(chapterUrl, {
    timeout: 20000,
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; KrishnaMercyBot/1.0)",
    },
  });

  const $ = cheerio.load(data);
  const refs = new Set();

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) {
      return;
    }

    const match = href.match(new RegExp(`^/en/library/bg/${chapter}/([0-9]+(?:-[0-9]+)?)/$`));
    if (match && match[1]) {
      refs.add(match[1]);
    }
  });

  return [...refs].sort((a, b) => parseVerseStart(a) - parseVerseStart(b));
};

const scrapeGita = async () => {
  const results = [];

  for (let chapter = 1; chapter <= 18; chapter += 1) {
    console.log(`Scraping Chapter ${chapter}...`);

    let verseRefs = [];
    try {
      verseRefs = await getChapterVerseRefs(chapter);
    } catch (error) {
      console.log(`Failed to load chapter index ${chapter}: ${error.message}`);
      continue;
    }

    for (const verseRef of verseRefs) {
      const verseData = await scrapeVerse(chapter, verseRef);

      if (verseData) {
        results.push(verseData);
        console.log(`Saved BG ${chapter}.${verseRef}`);
      }

      // Delay between requests helps avoid temporary blocking.
      await delay(1000);
    }

    saveResults(results);
    console.log(`Checkpoint saved after Chapter ${chapter}. Total verses: ${results.length}`);
  }

  saveResults(results);
  console.log(`Scraping completed. Saved ${results.length} verses to ${OUTPUT_PATH}`);
};

scrapeGita();
