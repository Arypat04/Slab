import { GoogleGenerativeAI, type Part } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

// Try primary model first, fall back if overloaded
const MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

export interface GradeResult {
  cardName: string;
  cardSet: string;
  cardNumber: string;
  variant: string;
  predictedGrade: number;
  gradeName: string;
  confidence: number;
  subGrades: { centering: number; corners: number; edges: number; surface: number };
  centeringLR: { left: number; right: number };
  centeringTB: { top: number; bottom: number };
  defects: string[];
  whyNot: string;
  rawValue: number;
  gradedValue: number;
  psaGradedValue: number;
  cgcGradedValue: number;
  tgsGradedValue: number;
  bgsGradedValue: number;
}

const SYSTEM_PROMPT = `You are an expert trading card grading AI. Analyze the provided card image(s) and return a JSON object with this exact shape:

{
  "cardName": "string — card name e.g. 'Charizard ex'",
  "cardSet": "string — set name e.g. 'Pokémon 151'",
  "cardNumber": "string — e.g. '#199'",
  "variant": "string — e.g. 'Holo' or 'Reverse Holo' or ''",
  "predictedGrade": number (1-10 PSA scale),
  "gradeName": "string — e.g. 'Mint' for 9, 'Gem Mint' for 10",
  "confidence": number (0-100 integer),
  "subGrades": {
    "centering": number (0.1 increments, 1-10),
    "corners": number,
    "edges": number,
    "surface": number
  },
  "centeringLR": { "left": number (0-100), "right": number (0-100) },
  "centeringTB": { "top": number (0-100), "bottom": number (0-100) },
  "defects": ["array of observed defect strings"],
  "whyNot": "string — 1-2 sentences explaining why the card did not receive a 10",
  "rawValue": number (USD estimate for ungraded copy),
  "gradedValue": number (USD estimate for predicted PSA grade),
  "psaGradedValue": number,
  "cgcGradedValue": number,
  "tgsGradedValue": number,
  "bgsGradedValue": number
}

If a back image is provided, use it to assess edge and surface condition more accurately. Base value estimates on real market comps. Return only the JSON object, no markdown.`;

function isOverloadedError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return msg.includes('overloaded') || msg.includes('high demand') ||
    msg.includes('503') || msg.includes('resource_exhausted') ||
    msg.includes('quota') || msg.includes('unavailable');
}

export async function gradeCardImage(
  frontImageBase64: string,
  backImageBase64?: string,
): Promise<GradeResult> {
  let lastError: Error = new Error('No models available');

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: { responseMimeType: 'application/json' },
      });

      const parts: Part[] = [
        { inlineData: { mimeType: 'image/jpeg' as const, data: frontImageBase64 } },
        ...(backImageBase64
          ? [{ inlineData: { mimeType: 'image/jpeg' as const, data: backImageBase64 } }]
          : []),
        { text: 'Grade this trading card.' },
      ];

      const result = await model.generateContent(parts);
      const text = result.response.text();
      return JSON.parse(text) as GradeResult;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (!isOverloadedError(lastError)) throw lastError;
      console.warn(`[gemini] ${modelName} overloaded, trying fallback…`);
    }
  }

  throw lastError;
}
