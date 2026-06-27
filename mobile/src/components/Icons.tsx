import React from 'react';
import Svg, { Path, Circle, Rect, Polygon } from 'react-native-svg';

interface IconProps {
  color?: string;
  size?: number;
}

export function HomeIcon({ color = '#9aa6a0', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M3 9l8-6 8 6v9a1 1 0 0 1-1 1h-4v-6H8v6H4a1 1 0 0 1-1-1Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CollectionIcon({ color = '#9aa6a0', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x="3" y="5" width="16" height="12" rx="2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M7 5V3h8v2" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CameraIcon({ color = '#04332c', size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none">
      <Path d="M4 8.5A2.5 2.5 0 0 1 6.5 6h1.2L9.5 3.5h7L18.3 6h1.2A2.5 2.5 0 0 1 22 8.5V18a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="13" cy="13" r="4" stroke={color} strokeWidth={2.2} />
    </Svg>
  );
}

export function InsightsIcon({ color = '#9aa6a0', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M3 18V9M9 18V4M15 18v-7" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ProfileIcon({ color = '#9aa6a0', size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="7" r="4" stroke={color} strokeWidth={1.8} />
      <Path d="M3 19a8 8 0 0 1 16 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function SearchIcon({ color = '#0d1b17', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Circle cx="7" cy="7" r="5" stroke={color} strokeWidth={1.6} />
      <Path d="m14 14-3.5-3.5" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}

export function BellIcon({ color = '#0d1b17', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 2a4 4 0 0 0-4 4c0 4-2 5-2 5h12s-2-1-2-5a4 4 0 0 0-4-4ZM6.5 13.5a1.5 1.5 0 0 0 3 0" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ChevronLeftIcon({ color = '#0d1b17' }: IconProps) {
  return (
    <Svg width={9} height={16} viewBox="0 0 9 16" fill="none">
      <Path d="M8 1 1 8l7 7" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function PlusIcon({ color = '#ffffff', size = 16 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <Path d="M8 3v10M3 8h10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

export function SaveIcon({ color = '#0d1b17', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M14 16V8a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v8m6-9V3a1 1 0 0 1 1-1a1 1 0 0 1 1 1v4" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function HeartIcon({ color = '#0d1b17', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Path d="M9 16s-6-4-6-8.5A3.5 3.5 0 0 1 9 5a3.5 3.5 0 0 1 6 2.5C15 12 9 16 9 16Z" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function SunIcon({ color = '#7c8a84' }: IconProps) {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <Circle cx="7" cy="7" r="3" stroke={color} strokeWidth={1.5} />
      <Path d="M7 1v1.5M7 11.5V13M1 7h1.5M11.5 7H13M2.8 2.8l1 1M10.2 10.2l1 1M11.2 2.8l-1 1M3.8 10.2l-1 1" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}

export function MoonIcon({ color = '#7c8a84' }: IconProps) {
  return (
    <Svg width={13} height={13} viewBox="0 0 14 14" fill="none">
      <Path d="M11.5 8.5A5 5 0 1 1 5.5 2.5a4 4 0 0 0 6 6Z" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function ArrowUpIcon({ color = '#5ee49f', size = 10 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path d="M2 7 7 2M4 2h3v3" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function CheckIcon({ color = '#04332c', size = 10 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none">
      <Path d="M1.5 5 4 7.5 8.5 2.5" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function GalleryIcon({ color = '#0d1b17', size = 20 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x="3" y="4" width="14" height="12" rx="2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx="10" cy="10" r="3" stroke={color} strokeWidth={1.7} />
    </Svg>
  );
}

export function FlashIcon({ size = 17 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 17 17">
      <Polygon points="9,1 3,9 7,9 6,16 12,8 8,8" fill="#f0a83a" />
    </Svg>
  );
}

export function AppearanceIcon({ color = '#0d1b17', size = 18 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
      <Circle cx="9" cy="9" r="3.5" stroke={color} strokeWidth={1.6} />
      <Path d="M9 1.5V3M9 15v1.5M1.5 9H3M15 9h1.5M3.5 3.5l1 1M13.5 13.5l1 1M14.5 3.5l-1 1M4.5 13.5l-1 1" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </Svg>
  );
}
