import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

// Simple TTL cache — avoids repeat API calls for the same query
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes
const cache = new Map<string, { cards: CardSearchResult[]; expires: number }>();

function getCached(key: string): CardSearchResult[] | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (entry.expires < Date.now()) { cache.delete(key); return null; }
  return entry.cards;
}

function setCached(key: string, cards: CardSearchResult[]): void {
  if (cache.size >= 200) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { cards, expires: Date.now() + CACHE_TTL });
}

export interface CardSearchResult {
  cardName: string;
  cardSet: string;
  cardNumber: string;
  variant: string;
  game: string;
  rawValue: number;
  gradedValue: number;
  psaGradedValue: number;
  cgcGradedValue: number;
}

// Maps Pokemon TCG API price type keys to human-readable variant labels
const PRICE_LABELS: Record<string, string> = {
  holofoil: 'Holo',
  reverseHolofoil: 'Reverse Holo',
  '1stEditionHolofoil': '1st Ed Holo',
  '1stEditionNormal': '1st Edition',
  unlimitedHolofoil: 'Unlimited Holo',
  normal: '',
  unlimited: '',
};

interface PokemonCard {
  name: string;
  set?: { name?: string };
  number?: string;
  rarity?: string;
  tcgplayer?: {
    prices?: Record<string, { market?: number; mid?: number }>;
  };
}

async function searchPokemonTCG(query: string): Promise<CardSearchResult[]> {
  const q = encodeURIComponent(`name:*${query}*`);
  const url = `https://api.pokemontcg.io/v2/cards?q=${q}&pageSize=20&orderBy=-set.releaseDate`;

  const response = await fetch(url);
  if (!response.ok) return [];

  const data = await response.json() as { data?: PokemonCard[] };
  const results: CardSearchResult[] = [];

  for (const card of data.data ?? []) {
    const prices = card.tcgplayer?.prices ?? {};
    const priceKeys = Object.keys(prices);

    if (priceKeys.length === 0) {
      results.push({
        cardName: card.name,
        cardSet: card.set?.name ?? '',
        cardNumber: card.number ? `#${card.number}` : '',
        variant: card.rarity ?? '',
        game: 'Pokemon',
        rawValue: 0,
        gradedValue: 0,
        psaGradedValue: 0,
        cgcGradedValue: 0,
      });
    } else {
      for (const key of priceKeys) {
        const market = prices[key]?.market ?? prices[key]?.mid ?? 0;
        const raw = Math.round(market);
        // PSA 9 typically trades at 3–4× raw for modern cards
        const psa9 = Math.round(raw * 3.2);
        results.push({
          cardName: card.name,
          cardSet: card.set?.name ?? '',
          cardNumber: card.number ? `#${card.number}` : '',
          variant: PRICE_LABELS[key] ?? key,
          game: 'Pokemon',
          rawValue: raw,
          gradedValue: psa9,
          psaGradedValue: psa9,
          cgcGradedValue: Math.round(psa9 * 0.9),
        });
      }
    }

    if (results.length >= 8) break;
  }

  return results.slice(0, 8);
}

async function searchSportsWithGemini(query: string): Promise<CardSearchResult[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: { responseMimeType: 'application/json' },
  });

  const prompt = `A user is searching for a trading card: "${query}"

Return a JSON array of up to 5 real trading cards matching this search. Include different sets, years, and variants where applicable. Each object must have exactly these fields:
{
  "cardName": "string",
  "cardSet": "string",
  "cardNumber": "string or empty string",
  "variant": "e.g. Rookie, RC, Gold, Base, Young Guns, or empty string",
  "game": "NHL, NBA, NFL, MLB, MTG, or Other",
  "rawValue": number,
  "gradedValue": number,
  "psaGradedValue": number,
  "cgcGradedValue": number
}

Use real current USD market values. Return only the JSON array, no markdown.`;

  const result = await model.generateContent(prompt);
  const parsed = JSON.parse(result.response.text());
  return Array.isArray(parsed) ? (parsed as CardSearchResult[]) : [];
}

router.get('/', async (req: Request, res: Response) => {
  const { q } = req.query as { q?: string };

  if (!q || typeof q !== 'string' || q.trim().length < 2) {
    res.status(400).json({ error: 'Query must be at least 2 characters' });
    return;
  }

  if (!process.env.GEMINI_API_KEY) {
    res.status(500).json({ error: 'GEMINI_API_KEY not configured' });
    return;
  }

  try {
    const cacheKey = q.trim().toLowerCase();
    const cached = getCached(cacheKey);
    if (cached) {
      res.json({ cards: cached });
      return;
    }

    // Real database for Pokemon; Gemini for sports/other
    let cards = await searchPokemonTCG(q.trim());
    if (cards.length === 0) {
      cards = await searchSportsWithGemini(q.trim());
    }

    setCached(cacheKey, cards);
    res.json({ cards });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[search]', message);
    res.status(500).json({ error: message });
  }
});

export default router;
