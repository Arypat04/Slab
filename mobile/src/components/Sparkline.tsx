import React from 'react';
import Svg, { Polyline, Polygon } from 'react-native-svg';

interface SparklineProps {
  points: string;
  width: number;
  height: number;
  color?: string;
}

export function Sparkline({ points, width, height, color = '#00c2a8' }: SparklineProps) {
  const fillPoints = `${points} ${width},${height} 0,${height}`;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <Polygon points={fillPoints} fill="rgba(0,194,168,0.12)" />
      <Polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
