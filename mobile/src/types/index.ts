export interface CardItem {
  id: string;
  name: string;
  set: string;
  cardNumber: string;
  variant: string;
  grade: string;
  isRaw: boolean;
  value: number;
  purchasePrice: number;
  certNumber?: string;
  imageUri?: string;
  game: string;
  createdAt: string;
}

export interface SubGrades {
  centering: number;
  corners: number;
  edges: number;
  surface: number;
}

export interface GradeResult {
  cardName: string;
  cardSet: string;
  cardNumber: string;
  variant: string;
  predictedGrade: number;
  gradeName: string;
  confidence: number;
  subGrades: SubGrades;
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

export type Tier = 'free' | 'plus' | 'pro';
export type ThemeMode = 'light' | 'dark';
