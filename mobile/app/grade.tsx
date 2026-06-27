import React, { useState } from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView, Image,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { SlabCard } from '../src/components/SlabCard';
import { ChevronLeftIcon, SunIcon, MoonIcon } from '../src/components/Icons';
import type { CardItem } from '../src/types';

const GRADE_NAMES: Record<number, string> = {
  10: 'GEM MT', 9: 'MINT', 8: 'NM-MT', 7: 'NM', 6: 'EX-MT',
  5: 'EX', 4: 'VG-EX', 3: 'VG', 2: 'GOOD', 1: 'POOR',
};

function inferGame(cardSet: string): string {
  const s = cardSet.toLowerCase();
  if (s.includes('nhl') || s.includes('hockey') || s.includes('upper deck')) return 'NHL';
  if (s.includes('nba') || s.includes('basketball') || s.includes('prizm')) return 'NBA';
  if (s.includes('nfl') || s.includes('football')) return 'NFL';
  if (s.includes('mlb') || s.includes('baseball') || s.includes('topps')) return 'MLB';
  if (s.includes('pokemon') || s.includes('pokémon') || s.includes('ptcg')) return 'Pokemon';
  if (s.includes('magic') || s.includes('mtg')) return 'MTG';
  return 'Other';
}

function SubGradeCard({ label, value }: { label: string; value: number }) {
  const t = useTheme();
  const pct = (value / 10) * 100;
  return (
    <View style={[styles.subCard, { backgroundColor: t.surface, borderColor: t.line }]}>
      <View style={styles.subCardHeader}>
        <Text style={[styles.subLabel, { color: t.muted }]}>{label}</Text>
        <Text style={[styles.subValue, { color: t.ink }]}>{value.toFixed(1)}</Text>
      </View>
      <View style={[styles.subTrack, { backgroundColor: t.track }]}>
        <View style={[styles.subFill, { width: `${pct}%` }]} />
      </View>
    </View>
  );
}

export default function Grade() {
  const t = useTheme();
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const grade = useAppStore((s) => s.currentGrade);
  const addCard = useAppStore((s) => s.addCard);
  const capturedImageUri = useAppStore((s) => s.capturedImageUri);
  const [saved, setSaved] = useState(false);

  const g = grade ?? {
    cardName: 'Charizard ex',
    cardSet: 'POKÉMON 151',
    cardNumber: '#199',
    variant: 'HOLO',
    predictedGrade: 9,
    gradeName: 'MINT',
    confidence: 92,
    subGrades: { centering: 8.5, corners: 9.0, edges: 9.5, surface: 9.0 },
    centeringLR: { left: 55, right: 45 },
    centeringTB: { top: 50, bottom: 50 },
    defects: [],
    whyNot: 'Centering sits slightly left (55/45). Corners are sharp.',
    rawValue: 95,
    gradedValue: 430,
    psaGradedValue: 430,
    cgcGradedValue: 396,
    tgsGradedValue: 366,
    bgsGradedValue: 378,
  };

  const displayGradeName = GRADE_NAMES[g.predictedGrade] ?? g.gradeName;
  const netProfit = g.gradedValue - g.rawValue - 19 - 22 - Math.round(g.gradedValue * 0.12);

  const saveToCollection = () => {
    if (saved) return;
    const card: CardItem = {
      id: Date.now().toString(),
      name: g.cardName,
      set: g.cardSet,
      cardNumber: g.cardNumber,
      variant: g.variant,
      grade: `PSA ${g.predictedGrade}`,
      isRaw: false,
      value: g.gradedValue,
      purchasePrice: 0,
      imageUri: capturedImageUri ?? undefined,
      game: inferGame(g.cardSet),
      createdAt: new Date().toISOString(),
    };
    addCard(card);
    setSaved(true);
    setTimeout(() => router.push('/(tabs)/collection'), 600);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]} hitSlop={8}>
          <ChevronLeftIcon color={t.ink} />
        </Pressable>
        <Text style={[styles.title, { color: t.ink }]}>Grade Result</Text>
        <Pressable
          onPress={toggleTheme}
          style={[styles.themeToggle, { backgroundColor: t.surface, borderColor: t.line2 }]}
        >
          <SunIcon color={t.muted} />
          <MoonIcon color={t.muted} />
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Card thumb + grade slab */}
        <View style={styles.topRow}>
          <View style={[styles.cardThumb, { backgroundColor: t.surface2, borderColor: t.line2 }]}>
            {capturedImageUri ? (
              <Image source={{ uri: capturedImageUri }} style={StyleSheet.absoluteFill} resizeMode="cover" />
            ) : (
              <View style={[styles.frontBadge, { backgroundColor: t.ink }]}>
                <Text style={[styles.frontBadgeText, { color: t.bg }]}>FRONT</Text>
              </View>
            )}
          </View>

          <SlabCard style={{ flex: 1 }} radius={20} padding={16}>
            <View style={styles.glowCircle} />
            <Text style={styles.predictedLabel}>PREDICTED · PSA</Text>
            <View style={styles.gradeRow}>
              <Text style={[styles.gradeNum, { color: t.gradeNum }]}>{g.predictedGrade}</Text>
              <Text style={styles.gradeName}>{displayGradeName}</Text>
            </View>
            <View style={styles.confidenceRow}>
              <View style={styles.confidenceDot} />
              <Text style={styles.confidenceText}>{g.confidence}% confidence</Text>
            </View>
          </SlabCard>
        </View>

        {/* Card name + find card button */}
        <View style={styles.cardNameWrap}>
          <View style={styles.cardNameRow}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.cardName, { color: t.ink }]}>{g.cardName}</Text>
              <Text style={[styles.cardMeta, { color: t.muted }]}>
                {[g.cardSet, g.cardNumber, g.variant].filter(Boolean).join(' · ').toUpperCase()}
              </Text>
            </View>
            <Pressable
              onPress={() => router.push('/card-search')}
              style={[styles.findCardBtn, { backgroundColor: t.surface2, borderColor: t.line2 }]}
              hitSlop={8}
            >
              <Text style={[styles.findCardText, { color: t.muted }]}>Wrong card?</Text>
            </Pressable>
          </View>
        </View>

        {/* Sub-grades grid */}
        <View style={styles.subGrid}>
          <SubGradeCard label="CENTERING" value={g.subGrades.centering} />
          <SubGradeCard label="CORNERS" value={g.subGrades.corners} />
          <SubGradeCard label="EDGES" value={g.subGrades.edges} />
          <SubGradeCard label="SURFACE" value={g.subGrades.surface} />
        </View>

        {/* Centering L/R */}
        <View style={[styles.centeringCard, { backgroundColor: t.surface, borderColor: t.line }]}>
          <View style={styles.centeringHeader}>
            <Text style={[styles.centeringLabel, { color: t.muted }]}>CENTERING L/R</Text>
            <Text style={[styles.centeringValue, { color: t.ink }]}>
              {g.centeringLR.left} / {g.centeringLR.right}
            </Text>
          </View>
          <View style={[styles.centeringTrack, { backgroundColor: t.track }]}>
            <View style={[styles.centeringFill, { width: `${g.centeringLR.left}%` }]} />
            <View style={[styles.centeringMark, { backgroundColor: t.ink }]} />
          </View>
        </View>

        {/* Why not 10 */}
        <View style={[styles.warnCard, { backgroundColor: t.warnBg, borderColor: t.warnLine }]}>
          <View style={styles.warnBadge}>
            <Text style={styles.warnBadgeText}>?</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.warnTitle, { color: t.warnInk }]}>Why not a 10?</Text>
            <Text style={[styles.warnBody, { color: t.warnSub }]}>{g.whyNot}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, { backgroundColor: t.footer, borderTopColor: t.line }]}>
        <Pressable
          onPress={saveToCollection}
          style={[styles.saveBtn, { backgroundColor: saved ? '#18b368' : t.surface2 }]}
        >
          <Text style={[styles.saveBtnIcon, { color: saved ? '#fff' : t.ink }]}>
            {saved ? '✓' : '↓'}
          </Text>
        </Pressable>
        <Pressable onPress={() => router.push('/roi')} style={styles.roiBtn}>
          <Text style={styles.roiBtnText}>See ROI · ${netProfit > 0 ? '+' : ''}{netProfit} net</Text>
        </Pressable>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12, paddingTop: 4 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 17 },
  themeToggle: { flexDirection: 'row', alignItems: 'center', gap: 2, borderRadius: 100, borderWidth: 1, padding: 3 },
  topRow: { flexDirection: 'row', gap: 14, alignItems: 'stretch', marginBottom: 16 },
  cardThumb: { width: 104, borderRadius: 16, borderWidth: 1, minHeight: 148, overflow: 'hidden', justifyContent: 'flex-start', padding: 8 },
  frontBadge: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6, alignSelf: 'flex-start' },
  frontBadgeText: { fontFamily: 'DMMono_400Regular', fontSize: 9 },
  glowCircle: { position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: 'rgba(0,194,168,0.45)' },
  predictedLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 1.2, color: '#7fe9d8' },
  gradeRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  gradeNum: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 58, lineHeight: 62, letterSpacing: -1 },
  gradeName: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 17, color: '#7fe9d8' },
  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  confidenceDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#00c2a8' },
  confidenceText: { fontFamily: 'DMMono_400Regular', fontSize: 12, color: '#9fb0aa' },
  cardNameWrap: { marginBottom: 14 },
  cardNameRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  cardName: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 19 },
  cardMeta: { fontFamily: 'DMMono_400Regular', fontSize: 11, marginTop: 3 },
  findCardBtn: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1, flexShrink: 0 },
  findCardText: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 12 },
  subGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
  subCard: { width: '47%', borderRadius: 16, padding: 13, borderWidth: 1 },
  subCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  subLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 0.6 },
  subValue: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20 },
  subTrack: { height: 4, borderRadius: 3, marginTop: 9 },
  subFill: { height: '100%', backgroundColor: '#00c2a8', borderRadius: 3 },
  centeringCard: { borderRadius: 16, padding: 14, borderWidth: 1, marginBottom: 12 },
  centeringHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  centeringLabel: { fontFamily: 'DMMono_400Regular', fontSize: 11 },
  centeringValue: { fontFamily: 'DMMono_500Medium', fontSize: 11 },
  centeringTrack: { height: 8, borderRadius: 3, overflow: 'hidden', position: 'relative' },
  centeringFill: { height: '100%', backgroundColor: '#00c2a8' },
  centeringMark: { position: 'absolute', left: '50%', top: -3, width: 1, height: 14 },
  warnCard: { borderRadius: 16, padding: 13, borderWidth: 1, flexDirection: 'row', gap: 11 },
  warnBadge: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#f0a83a', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  warnBadgeText: { color: '#fff', fontFamily: 'HankenGrotesk_800ExtraBold', fontSize: 13 },
  warnTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 13, marginBottom: 2 },
  warnBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, lineHeight: 17 },
  footer: { padding: 12, paddingBottom: 14, borderTopWidth: 1, flexDirection: 'row', gap: 10 },
  saveBtn: { width: 50, height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  saveBtnIcon: { fontSize: 20 },
  roiBtn: { flex: 1, height: 50, borderRadius: 14, backgroundColor: '#00c2a8', alignItems: 'center', justifyContent: 'center' },
  roiBtnText: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 15, color: '#04332c' },
});
