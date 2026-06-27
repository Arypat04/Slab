import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, Animated, Pressable, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { gradeCard } from '../src/api/grader';
import Svg, { Path, Circle } from 'react-native-svg';

type Step = 'identified' | 'centering' | 'defects' | 'pricing';
const STEPS: { key: Step; label: string }[] = [
  { key: 'identified', label: 'Identified card' },
  { key: 'centering', label: 'Measured centering' },
  { key: 'defects', label: 'Detecting defects…' },
  { key: 'pricing', label: 'Pricing' },
];

export default function Analysis() {
  const t = useTheme();
  const capturedUri = useAppStore((s) => s.capturedImageUri);
  const capturedBackUri = useAppStore((s) => s.capturedBackImageUri);
  const setCurrentGrade = useAppStore((s) => s.setCurrentGrade);
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Scan line animation
  const scanAnim = useRef(new Animated.Value(0)).current;
  // Spinner animation
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const scan = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, { toValue: 1, duration: 1600, useNativeDriver: true }),
        Animated.timing(scanAnim, { toValue: 0, duration: 1600, useNativeDriver: true }),
      ]),
    );
    const spin = Animated.loop(
      Animated.timing(spinAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
    );
    scan.start();
    spin.start();
    return () => { scan.stop(); spin.stop(); };
  }, []);

  useEffect(() => {
    const runAnalysis = async () => {
      if (!capturedUri) {
        router.replace('/scan');
        return;
      }

      // Step progress timer
      const timer1 = setTimeout(() => setStepIndex(1), 600);
      const timer2 = setTimeout(() => setStepIndex(2), 1400);

      try {
        const result = await gradeCard(capturedUri, capturedBackUri ?? undefined);
        setCurrentGrade(result);
        setStepIndex(3);
        router.replace('/grade');
      } catch (err: unknown) {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setError(err instanceof Error ? err.message : 'Could not analyze card. Try again.');
      }
    };

    runAnalysis();
  }, [capturedUri]);

  const scanTranslateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const spinRotate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (error) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
        <View style={styles.errorWrap}>
          <Text style={[styles.errorTitle, { color: t.ink }]}>Couldn't analyze card</Text>
          <Text style={[styles.errorBody, { color: t.muted2 }]}>{error}</Text>
          <Pressable onPress={() => router.back()} style={styles.retryBtn}>
            <Text style={styles.retryText}>Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <Text style={[styles.header, { color: t.accentDeep }]}>ANALYZING</Text>

      {/* Card with scan line */}
      <View style={styles.cardWrap}>
        <View style={[styles.cardPlaceholder, { backgroundColor: t.surface2, borderColor: t.line2 }]}>
          <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanTranslateY }] }]} />
        </View>
        <Text style={[styles.analyzing, { color: t.ink }]}>Identifying…</Text>
      </View>

      {/* Step checklist */}
      <View style={[styles.steps, { backgroundColor: t.surface, borderColor: t.line }]}>
        {STEPS.map((step, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          const pending = i > stepIndex;

          return (
            <View key={step.key} style={[styles.stepRow, i < STEPS.length - 1 && { borderBottomWidth: 1, borderBottomColor: t.line }]}>
              {done ? (
                <View style={styles.checkCircle}>
                  <Svg width={11} height={11} viewBox="0 0 11 11" fill="none">
                    <Path d="M2 5.5 4.3 8 9 3" stroke="#04332c" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </Svg>
                </View>
              ) : active ? (
                <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spinRotate }] }]} />
              ) : (
                <View style={[styles.pendingCircle, { borderColor: t.muted }]} />
              )}
              <Text style={[styles.stepLabel, { color: pending ? t.muted2 : t.ink, opacity: pending ? 0.45 : 1 }]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { fontFamily: 'DMMono_400Regular', fontSize: 12, letterSpacing: 1.4, textAlign: 'center', paddingTop: 14 },
  cardWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  cardPlaceholder: {
    width: 220, height: 308, borderRadius: 16, borderWidth: 1, overflow: 'hidden',
    shadowColor: '#0d1b17', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.16, shadowRadius: 34,
  },
  scanLine: {
    position: 'absolute', left: '6%', right: '6%', height: 3,
    backgroundColor: 'transparent',
    borderRadius: 3,
    shadowColor: '#00c2a8', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 8,
    // Teal scan line
    borderWidth: 1.5, borderColor: '#00c2a8',
  },
  analyzing: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 30, marginTop: 28 },
  steps: {
    marginHorizontal: 32, marginBottom: 40, borderRadius: 18, borderWidth: 1, paddingHorizontal: 16,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 7 },
  checkCircle: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  spinnerRing: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#00c2a8',
    borderTopColor: 'transparent', flexShrink: 0,
  },
  pendingCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, flexShrink: 0 },
  stepLabel: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 14 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  errorTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 22, textAlign: 'center', marginBottom: 12 },
  errorBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 15, lineHeight: 22, textAlign: 'center', marginBottom: 24 },
  retryBtn: { backgroundColor: '#00c2a8', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14 },
  retryText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 16, color: '#04332c' },
});
