import * as ImageManipulator from 'expo-image-manipulator';
import { API_URL } from '../config';
import type { GradeResult } from '../types';

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

export async function searchCards(query: string): Promise<CardSearchResult[]> {
  const url = `${API_URL}/api/search-cards?q=${encodeURIComponent(query)}`;
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(`Cannot reach backend at ${url}`);
  }
  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Server error ${response.status}`);
  }
  const data = await response.json() as { cards: CardSearchResult[] };
  return data.cards ?? [];
}

async function resizeToBase64(uri: string): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true },
  );
  if (!result.base64) throw new Error('Failed to encode image');
  return result.base64;
}

export async function gradeCard(frontUri: string, backUri?: string): Promise<GradeResult> {
  const imageBase64 = await resizeToBase64(frontUri);
  const backImageBase64 = backUri ? await resizeToBase64(backUri) : undefined;

  const url = `${API_URL}/api/grade`;
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, backImageBase64 }),
    });
  } catch {
    throw new Error(
      `Cannot reach backend at ${url}\n\nMake sure:\n• Backend is running (npm run dev)\n• EXPO_PUBLIC_API_URL is set to your machine's local IP (not localhost)`,
    );
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Server error ${response.status}`);
  }

  return response.json() as Promise<GradeResult>;
}
