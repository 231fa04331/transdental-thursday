const axios = require("axios");
const fs = require("fs");
const path = require("path");
const env = require("../config/env");

const CACHE_TTL_MS = 15 * 60 * 1000;
const MAX_CONTEXT_RESULTS = 3;
const queryCache = new Map();
const gitaDataPath = path.join(__dirname, "..", "data", "gita.json");
let gitaDataset = null;
const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "gita",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "the",
  "to",
  "what",
  "which",
  "who",
  "why",
  "with",
]);

const getCachedResponse = (cacheKey) => {
  const entry = queryCache.get(cacheKey);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    queryCache.delete(cacheKey);
    return null;
  }

  return entry.value;
};

const setCachedResponse = (cacheKey, value) => {
  queryCache.set(cacheKey, {
    value,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
};

const buildPrompt = (userMessage, scriptureContext) => {
  return [
    "You are a Krishna-conscious spiritual guide.",
    "Rules:",
    "- Answer based ONLY on provided scripture context.",
    "- Be devotional, humble, and clear.",
    "- Use simple language.",
    "- If answer is not present in context, say: I am not sure based on scriptures.",
    "",
    `User Question: ${userMessage}`,
    "",
    "Bhagavad Gita Context:",
    scriptureContext,
  ].join("\n");
};

const loadGitaDataset = () => {
  if (gitaDataset) {
    return gitaDataset;
  }

  if (!fs.existsSync(gitaDataPath)) {
    gitaDataset = [];
    return gitaDataset;
  }

  try {
    const jsonRaw = fs.readFileSync(gitaDataPath, "utf8");
    const parsed = JSON.parse(jsonRaw);
    gitaDataset = Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("chatbot.service dataset load error:", error.message);
    gitaDataset = [];
  }

  return gitaDataset;
};

const normalize = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenize = (value) =>
  normalize(value)
    .split(" ")
    .filter((token) => token && token.length > 1 && !stopWords.has(token));

const verseSortValue = (verse) => {
  const text = String(verse || "").trim();
  const firstPart = text.split("-")[0];
  const parsed = Number.parseInt(firstPart, 10);
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
};

const getSortedDataset = (dataset) =>
  [...dataset].sort((a, b) => {
    const chapterA = Number(a.chapter || 0);
    const chapterB = Number(b.chapter || 0);
    if (chapterA !== chapterB) {
      return chapterA - chapterB;
    }

    return verseSortValue(a.verse) - verseSortValue(b.verse);
  });

const parseReferenceQuery = (queryText) => {
  const refMatch = queryText.match(/(?:chapter|ch)\s*(\d+)\s*(?:verse|sloka|shloka)\s*(\d+)/);
  if (refMatch) {
    return {
      chapter: Number.parseInt(refMatch[1], 10),
      verse: Number.parseInt(refMatch[2], 10),
    };
  }

  const compactRefMatch = queryText.match(/\b(\d{1,2})\s*[:.]\s*(\d{1,3})\b/);
  if (compactRefMatch) {
    return {
      chapter: Number.parseInt(compactRefMatch[1], 10),
      verse: Number.parseInt(compactRefMatch[2], 10),
    };
  }

  return null;
};

const formatContextEntries = (entries) =>
  entries
    .map((entry) => {
      const chapter = entry.chapter ?? "?";
      const verse = entry.verse ?? "?";
      const text = String(entry.text || "").trim();
      const purport = String(entry.purport || "").trim();
      return `BG ${chapter}.${verse}\nTranslation: ${text}\nPurport: ${purport}`.trim();
    })
    .join("\n\n");

const getLocalGitaContext = (userMessage) => {
  const dataset = loadGitaDataset();
  if (!dataset.length) {
    return "";
  }

  const normalizedQuery = normalize(userMessage);
  const sortedDataset = getSortedDataset(dataset);

  if (/\bfirst\b.*\b(verse|sloka|shloka)\b/.test(normalizedQuery)) {
    return formatContextEntries(sortedDataset.slice(0, 1));
  }

  if (/\blast\b.*\b(verse|sloka|shloka)\b/.test(normalizedQuery)) {
    return formatContextEntries(sortedDataset.slice(-1));
  }

  const ref = parseReferenceQuery(normalizedQuery);
  if (ref) {
    const refMatch = sortedDataset.find((entry) => {
      const chapter = Number(entry.chapter || 0);
      const verse = verseSortValue(entry.verse);
      return chapter === ref.chapter && verse === ref.verse;
    });

    if (refMatch) {
      return formatContextEntries([refMatch]);
    }
  }

  const queryTokens = tokenize(userMessage);
  if (!queryTokens.length) {
    return "";
  }

  const scored = sortedDataset
    .map((entry) => {
      const translation = normalize(entry.text);
      const purport = normalize(entry.purport);
      let score = 0;

      for (const token of queryTokens) {
        if (translation.includes(token)) {
          score += 3;
        } else if (purport.includes(token)) {
          score += 1;
        }
      }

      return { entry, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_RESULTS)
    .map((item) => item.entry);

  if (!scored.length) {
    return "";
  }

  return formatContextEntries(scored);
};

const getVedabaseContext = async (userMessage) => {
  const vedabaseApi = env.vedabaseApi;
  if (!vedabaseApi) {
    return "";
  }

  const vedabaseRes = await axios.get(vedabaseApi, {
    params: { q: userMessage },
    timeout: 10000,
  });

  const rawResults = vedabaseRes.data?.results;
  if (!Array.isArray(rawResults) || rawResults.length === 0) {
    return "";
  }

  return rawResults
    .slice(0, MAX_CONTEXT_RESULTS)
    .map((item) => (typeof item === "string" ? item : JSON.stringify(item)))
    .join("\n\n");
};

const getGeminiReply = async (promptText) => {
  const geminiApiKey = env.geminiApiKey;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const geminiRes = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
    {
      contents: [
        {
          parts: [{ text: promptText }],
        },
      ],
      generationConfig: {
        temperature: 0.3,
      },
    },
    {
      timeout: 15000,
    }
  );

  return geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
};

const looksWeakReply = (reply) => {
  const text = String(reply || "").trim();
  if (!text) {
    return true;
  }

  if (text.length < 40) {
    return true;
  }

  const onlyReference = /^\s*BG\s*\d+\.\d+\s*$/i.test(text);
  return onlyReference;
};

const cleanLabelPrefix = (value, label) =>
  String(value || "")
    .replace(new RegExp(`^${label}\\s*:?`, "i"), "")
    .trim();

const getShortMeaning = (purportText) => {
  const cleaned = cleanLabelPrefix(purportText, "Purport");
  if (!cleaned) {
    return "Reflect deeply on this verse and apply it gently in your daily life.";
  }

  const firstSentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  return firstSentence.slice(0, 260).trim();
};

const getDirectScriptureReply = (scriptureContext) => {
  const firstBlock = String(scriptureContext || "").split("\n\n")[0]?.trim();
  if (!firstBlock) {
    return "I am not sure based on scriptures.";
  }

  const lines = firstBlock.split("\n").map((line) => line.trim()).filter(Boolean);
  const verseReference = lines.find((line) => /^BG\s*\d+\.\d+/i.test(line)) || "BG reference";
  const translationLine = lines.find((line) => /^Translation\s*:?/i.test(line)) || "";
  const purportLine = lines.find((line) => /^Purport\s*:?/i.test(line)) || "";

  const translation = cleanLabelPrefix(translationLine, "Translation") || "Translation unavailable.";
  const meaning = getShortMeaning(purportLine);

  return [
    `From ${verseReference}:`,
    "",
    translation,
    "",
    `Meaning: ${meaning}`,
  ].join("\n");
};

const getChatbotResponse = async (message) => {
  const userMessage = String(message || "").trim();
  if (!userMessage) {
    return {
      response: "Please ask a spiritual question so I can help.",
      source: "fallback",
    };
  }

  const cacheKey = userMessage.toLowerCase();
  const cached = getCachedResponse(cacheKey);
  if (cached) {
    return {
      response: cached,
      source: "cache",
    };
  }

  try {
    const localContext = getLocalGitaContext(userMessage);
    const scriptureContext = localContext || (await getVedabaseContext(userMessage));

    if (!scriptureContext) {
      return {
        response: "I couldn't find relevant guidance in scriptures for this question.",
        source: "fallback",
      };
    }

    const prompt = buildPrompt(userMessage, scriptureContext);

    try {
      const geminiReply = await getGeminiReply(prompt);
      const finalResponse = looksWeakReply(geminiReply)
        ? getDirectScriptureReply(scriptureContext)
        : geminiReply;
      setCachedResponse(cacheKey, finalResponse);

      return {
        response: finalResponse,
        source: looksWeakReply(geminiReply) ? "rag-upgraded" : "rag",
      };
    } catch (geminiError) {
      console.error("chatbot.service gemini error:", geminiError.message);

      const directResponse = getDirectScriptureReply(scriptureContext);
      setCachedResponse(cacheKey, directResponse);

      return {
        response: directResponse,
        source: "local-fallback",
      };
    }
  } catch (error) {
    console.error("chatbot.service error:", error.message);
    return {
      response: "Sorry, I couldn't process your request right now.",
      source: "error",
    };
  }
};

module.exports = {
  getChatbotResponse,
};
