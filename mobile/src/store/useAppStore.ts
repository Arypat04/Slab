import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CardItem, GradeResult, Tier, ThemeMode } from '../types';

const SAMPLE_COLLECTION: CardItem[] = [
  {
    id: '1',
    name: 'Charizard ex',
    set: 'Pokémon 151',
    cardNumber: '#199',
    variant: 'Holo',
    grade: 'PSA 9',
    isRaw: false,
    value: 430,
    purchasePrice: 240,
    certNumber: '78412290',
    game: 'Pokemon',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Connor Bedard RC',
    set: '23-24 UD Young Guns',
    cardNumber: '',
    variant: '',
    grade: 'PSA 9.5',
    isRaw: false,
    value: 310,
    purchasePrice: 180,
    game: 'NHL',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Pikachu VMAX',
    set: 'Vivid Voltage',
    cardNumber: '#44',
    variant: 'Holo',
    grade: 'RAW',
    isRaw: true,
    value: 88,
    purchasePrice: 65,
    game: 'Pokemon',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Connor McDavid',
    set: '23-24 UD',
    cardNumber: '',
    variant: '',
    grade: 'PSA 10',
    isRaw: false,
    value: 540,
    purchasePrice: 236,
    game: 'NHL',
    createdAt: new Date().toISOString(),
  },
];

interface AppState {
  theme: ThemeMode;
  tier: Tier;
  onboardingDone: boolean;
  collection: CardItem[];
  selectedCardId: string | null;
  capturedImageUri: string | null;
  capturedBackImageUri: string | null;
  currentGrade: GradeResult | null;
  scanCount: number;
  scanCountMonth: string;
  priceAlerts: Record<string, number>;

  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setTier: (tier: Tier) => void;
  setOnboardingDone: (done: boolean) => void;
  addCard: (card: CardItem) => void;
  updateCard: (id: string, updates: Partial<CardItem>) => void;
  removeCard: (id: string) => void;
  setSelectedCardId: (id: string | null) => void;
  setCapturedImageUri: (uri: string | null) => void;
  setCapturedBackImageUri: (uri: string | null) => void;
  setCurrentGrade: (result: GradeResult | null) => void;
  patchCurrentGrade: (fields: Partial<GradeResult>) => void;
  incrementScanCount: () => void;
  setPriceAlert: (cardId: string, target: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'light',
      tier: 'pro',
      onboardingDone: false,
      collection: SAMPLE_COLLECTION,
      selectedCardId: null,
      capturedImageUri: null,
      capturedBackImageUri: null,
      currentGrade: null,
      scanCount: 0,
      scanCountMonth: '',
      priceAlerts: {},

      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setTier: (tier) => set({ tier }),
      setOnboardingDone: (done) => set({ onboardingDone: done }),
      addCard: (card) =>
        set((s) => ({ collection: [card, ...s.collection] })),
      updateCard: (id, updates) =>
        set((s) => ({
          collection: s.collection.map((c) =>
            c.id === id ? { ...c, ...updates } : c,
          ),
        })),
      removeCard: (id) =>
        set((s) => ({ collection: s.collection.filter((c) => c.id !== id) })),
      setSelectedCardId: (id) => set({ selectedCardId: id }),
      setCapturedImageUri: (uri) => set({ capturedImageUri: uri }),
      setCapturedBackImageUri: (uri) => set({ capturedBackImageUri: uri }),
      setCurrentGrade: (result) => set({ currentGrade: result }),
      patchCurrentGrade: (fields) =>
        set((s) => s.currentGrade ? { currentGrade: { ...s.currentGrade, ...fields } } : {}),
      incrementScanCount: () =>
        set((s) => {
          const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"
          const reset = s.scanCountMonth !== month;
          return {
            scanCount: reset ? 1 : s.scanCount + 1,
            scanCountMonth: month,
          };
        }),
      setPriceAlert: (cardId, target) =>
        set((s) => {
          const alerts = { ...s.priceAlerts };
          if (target === null) {
            delete alerts[cardId];
          } else {
            alerts[cardId] = target;
          }
          return { priceAlerts: alerts };
        }),
    }),
    {
      name: 'slab-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        tier: state.tier,
        onboardingDone: state.onboardingDone,
        collection: state.collection,
        scanCount: state.scanCount,
        scanCountMonth: state.scanCountMonth,
        priceAlerts: state.priceAlerts,
      }),
    },
  ),
);
