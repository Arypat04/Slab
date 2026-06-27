import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme';

interface SlabCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  radius?: number;
  padding?: number;
}

export function SlabCard({ children, style, radius = 22, padding = 20 }: SlabCardProps) {
  const t = useTheme();
  const base: ViewStyle = {
    borderRadius: radius,
    padding,
    borderWidth: 1,
    borderColor: t.line2,
    overflow: 'hidden',
    position: 'relative',
  };

  if (t.mode === 'dark') {
    return (
      <LinearGradient
        colors={['#11201b', '#15302a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[base, style]}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View style={[base, { backgroundColor: '#0d1b17' }, style]}>
      {children}
    </View>
  );
}
