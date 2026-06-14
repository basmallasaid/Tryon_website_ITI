const MYMEMORY_ENDPOINT = "https://api.mymemory.translated.net/get";
const MAX_CHUNK_CHARS = 500;

function splitIntoChunks(text) {
  if (text.length <= MAX_CHUNK_CHARS) return [text];

  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > MAX_CHUNK_CHARS) {
      if (current.trim()) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0, MAX_CHUNK_CHARS)];
}

async function translateChunk(chunk) {
  try {
    const params = new URLSearchParams({
      q: chunk,
      langpair: "en|ar",
    });

    const res = await fetch(`${MYMEMORY_ENDPOINT}?${params}`);

    if (!res.ok) {
      console.error(`[Translation] Chunk failed (${res.status})`);
      return chunk;
    }

    const data = await res.json();
    if (data?.responseStatus === 200 && data?.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return chunk;
  } catch (err) {
    console.error("[Translation] Chunk call failed:", err.message);
    return chunk;
  }
}

async function translateToArabic(text) {
  if (!text || typeof text !== "string" || !text.trim()) return text;

  const chunks = splitIntoChunks(text);
  const translatedChunks = [];

  for (const chunk of chunks) {
    translatedChunks.push(await translateChunk(chunk));
  }

  return translatedChunks.join(" ");
}

export async function translateProduct(product) {
  const [name_ar, description_ar] = await Promise.all([
    translateToArabic(product.name),
    translateToArabic(product.description),
  ]);

  return {
    ...product,
    name_ar,
    description_ar,
  };
}

export async function translateProducts(products) {
  console.log(`[Translation] Translating ${products.length} products...`);

  const translated = await Promise.all(
    products.map((p) => translateProduct(p))
  );

  console.log("[Translation] Done");
  return translated;
}

export async function translateOutfitItems(items) {
  if (!items || !items.length) return items;

  const translated = await Promise.all(
    items.map(async (item) => {
      const [name_ar, style_ar] = await Promise.all([
        translateToArabic(item.name || ""),
        translateToArabic(item.style || item.category || ""),
      ]);
      return { ...item, name_ar, style_ar };
    })
  );

  return translated;
}

export async function translateOutfit(outfit) {
  if (!outfit) return outfit;

  const translatedItems = await translateOutfitItems(outfit.items || []);

  return {
    ...outfit,
    items: translatedItems,
  };
}
