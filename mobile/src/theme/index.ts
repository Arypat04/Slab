import { createContext, useContext } from 'react';

export const LIGHT = {
  bg: '#f6f8f7',
  surface: '#ffffff',
  surface2: '#f1f4f3',
  ink: '#0d1b17',
  muted: '#7c8a84',
  muted2: '#61716b',
  line: '#eaeeec',
  line2: '#e7ecea',
  accent: '#00c2a8',
  accentDeep: '#00a892',
  accentInk: '#04332c',
  slab: '#0d1b17' as string,
  slabSub: '#7fe9d8',
  slabMeta: '#9fb0aa',
  gradeNum: '#ffffff',
  track: '#eef2f0',
  pos: '#18b368',
  neg: '#f0533f',
  footer: '#ffffff',
  warnBg: '#fff7ec',
  warnLine: '#f6e4c5',
  warnInk: '#7a5a17',
  warnSub: '#9a7a36',
  thumb: '#eef2f0',
  mode: 'light' as 'light' | 'dark',
};

export const DARK: typeof LIGHT = {
  bg: '#0c1714',
  surface: '#13211c',
  surface2: '#15241f',
  ink: '#ffffff',
  muted: '#6f827b',
  muted2: '#9fb0aa',
  line: '#20342d',
  line2: '#243630',
  accent: '#00c2a8',
  accentDeep: '#00c2a8',
  accentInk: '#04332c',
  slab: '#11201b',
  slabSub: '#7fe9d8',
  slabMeta: '#9fb0aa',
  gradeNum: '#00c2a8',
  track: '#1f2f29',
  pos: '#5ee49f',
  neg: '#f0533f',
  footer: '#0f1c18',
  warnBg: 'rgba(240,168,58,0.1)',
  warnLine: 'rgba(240,168,58,0.28)',
  warnInk: '#f0c47a',
  warnSub: '#c9a86a',
  thumb: '#1a2823',
  mode: 'dark' as 'light' | 'dark',
};

export type Theme = typeof LIGHT;

export const ThemeContext = createContext<Theme>(LIGHT);

export function useTheme() {
  return useContext(ThemeContext);
}
