import React, { useRef, useState } from 'react';
import {
  View, Text, Pressable, StyleSheet, SafeAreaView,
  ScrollView, Dimensions, type NativeSyntheticEvent, type NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { CameraIcon } from '../src/components/Icons';

const { width: SCREEN_W } = Dimensions.get('window');

const SLIDES = [
  {
    eyebrow: 'SNAP · GRADE · KNOW',
    headline: 'AI grading from\ntwo photos',
    body: 'Shoot the front and back, get a predicted PSA grade with sub-grades in seconds.',
  },
  {
    eyebrow: 'BUY SMARTER',
    headline: 'Know the value\nbefore you buy',
    body: 'See raw and graded comps plus net ROI before you ever commit cash.',
  },
  {
    eyebrow: 'TRACK EVERYTHING',
    headline: 'Watch your\ncollection grow',
    body: 'Live portfolio value, real gem-rate, and price alerts on every card.',
  },
];

export default function Onboarding() {
  const [slide, setSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const t = useTheme();
  const setOnboardingDone = useAppStore((s) => s.setOnboardingDone);

  const goPaywall = () => {
    setOnboardingDone(true);
    router.replace('/paywall');
  };

  const next = () => {
    if (slide >= SLIDES.length - 1) {
      goPaywall();
    } else {
      const nextSlide = slide + 1;
      scrollRef.current?.scrollTo({ x: nextSlide * SCREEN_W, animated: true });
      setSlide(nextSlide);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
    setSlide(page);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Skip */}
      <View style={styles.skipRow}>
        <Pressable onPress={goPaywall} hitSlop={12}>
          <Text style={[styles.skip, { color: t.muted }]}>Skip</Text>
        </Pressable>
      </View>

      {/* Paged slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {SLIDES.map((s, i) => (
          <View key={i} style={[styles.page, { width: SCREEN_W }]}>
            {/* Hero illustration */}
            <View style={styles.heroArea}>
              <View style={styles.heroWrap}>
                <View style={styles.heroBg} />
                <View style={[styles.heroCard1, { backgroundColor: t.surface2, borderColor: t.line2 }]} />
                <View style={[styles.heroCard2, { backgroundColor: '#0d1b17', borderColor: t.line2 }]}>
                  <Text style={styles.heroGrade}>10</Text>
                </View>
                <View style={styles.heroBadge}>
                  <CameraIcon color="#04332c" size={20} />
                </View>
              </View>
            </View>

            {/* Copy */}
            <View style={styles.copy}>
              <Text style={[styles.eyebrow, { color: t.accentDeep }]}>{s.eyebrow}</Text>
              <Text style={[styles.headline, { color: t.ink }]}>{s.headline}</Text>
              <Text style={[styles.bodyText, { color: t.muted2 }]}>{s.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Dots + Next */}
      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === slide
                  ? { width: 24, backgroundColor: t.accent }
                  : { width: 7, backgroundColor: '#cdd6d2' },
              ]}
            />
          ))}
        </View>
        <Pressable onPress={next} style={[styles.btn, { backgroundColor: t.ink }]}>
          <Text style={[styles.btnText, { color: t.bg }]}>
            {slide >= SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: 26, paddingTop: 2 },
  skip: { fontSize: 14, fontFamily: 'HankenGrotesk_600SemiBold' },
  page: { alignItems: 'center' },
  heroArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20 },
  heroWrap: { width: 230, height: 296, position: 'relative' },
  heroBg: {
    position: 'absolute', inset: 0, borderRadius: 28,
    backgroundColor: 'rgba(0,194,168,0.08)',
  },
  heroCard1: {
    position: 'absolute', left: 30, top: 34, width: 118, height: 166,
    borderRadius: 12, borderWidth: 1,
    transform: [{ rotate: '-9deg' }],
    shadowColor: '#0d1b17', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.16, shadowRadius: 24,
  },
  heroCard2: {
    position: 'absolute', right: 26, bottom: 28, width: 118, height: 166,
    borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    transform: [{ rotate: '8deg' }],
    shadowColor: '#0d1b17', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.24, shadowRadius: 30,
  },
  heroGrade: {
    fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 40, color: '#00c2a8',
  },
  heroBadge: {
    position: 'absolute', right: 4, top: 6, width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00c2a8', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16,
  },
  copy: { paddingHorizontal: 34, alignItems: 'center', paddingBottom: 20 },
  eyebrow: {
    fontFamily: 'DMMono_400Regular', fontSize: 12, letterSpacing: 1.4, marginBottom: 14,
  },
  headline: {
    fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 32, lineHeight: 36,
    letterSpacing: -0.6, textAlign: 'center', marginBottom: 14,
  },
  bodyText: {
    fontFamily: 'HankenGrotesk_400Regular', fontSize: 15, lineHeight: 23,
    textAlign: 'center',
  },
  footer: { paddingHorizontal: 32, paddingBottom: 26 },
  dots: { flexDirection: 'row', gap: 7, justifyContent: 'center', marginBottom: 22 },
  dot: { height: 7, borderRadius: 4 },
  btn: {
    height: 56, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
  },
  btnText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 16 },
});
