import React from 'react';
import {
  View, Text, Pressable, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../src/theme';
import { useAppStore } from '../../src/store/useAppStore';
import { SlabCard } from '../../src/components/SlabCard';
import { Sparkline } from '../../src/components/Sparkline';
import { BellIcon, SearchIcon } from '../../src/components/Icons';

const SPARK = '0,60 1,64 2,58 3,68 4,66 5,72 6,70 7,76 8,74 9,80 10,78 11,86 12,84 13,90 14,94';

function StatChip({ label, value, sub, pos }: { label: string; value: string; sub?: string; pos?: boolean }) {
  const t = useTheme();
  return (
    <View style={[styles.statChip, { backgroundColor: t.surface, borderColor: t.line }]}>
      <Text style={[styles.statLabel, { color: t.muted }]}>{label}</Text>
      <Text style={[styles.statValue, { color: pos !== undefined ? (pos ? t.pos : t.neg) : t.ink }]}>{value}</Text>
      {sub && <Text style={[styles.statSub, { color: t.muted2 }]}>{sub}</Text>}
    </View>
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function Home() {
  const t = useTheme();
  const collection = useAppStore((s) => s.collection);

  const totalValue = collection.reduce((s, c) => s + c.value, 0);
  const rawCards = collection.filter((c) => c.isRaw).length;
  const gradedCards = collection.filter((c) => !c.isRaw).length;
  const totalCost = collection.reduce((s, c) => s + (c.purchasePrice ?? 0), 0);
  const gain = totalValue - totalCost;
  const gainPct = totalCost > 0 ? ((gain / totalCost) * 100).toFixed(1) : '0.0';
  const isPos = gain >= 0;

  const recentGrades = collection.filter((c) => !c.isRaw).slice(0, 4);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: t.muted }]}>{getGreeting()}</Text>
          <Text style={[styles.titleText, { color: t.ink }]}>Portfolio</Text>
        </View>
        <View style={styles.headerIcons}>
          <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]} hitSlop={8}>
            <SearchIcon color={t.ink} />
          </Pressable>
          <Pressable style={[styles.iconBtn, { backgroundColor: t.surface, borderColor: t.line2 }]} hitSlop={8}>
            <BellIcon color={t.ink} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
      >
        {/* Portfolio slab */}
        <SlabCard radius={22} padding={20} style={{ marginBottom: 12 }}>
          <View style={styles.glowCircle} />
          <Text style={styles.portfolioLabel}>PORTFOLIO VALUE</Text>
          <Text style={styles.portfolioValue}>${totalValue.toLocaleString()}</Text>
          <View style={styles.portfolioDeltaRow}>
            <View style={[styles.deltaBadge, { backgroundColor: isPos ? 'rgba(94,228,159,0.18)' : 'rgba(240,83,63,0.18)' }]}>
              <Text style={[styles.deltaBadgeText, { color: isPos ? '#5ee49f' : '#f0533f' }]}>
                {isPos ? '▲' : '▼'} {isPos ? '+' : ''}${gain} ({gainPct}%)
              </Text>
            </View>
            <Text style={styles.portfolioSub}>{collection.length} cards</Text>
          </View>
          <Sparkline points={SPARK} width={320} height={52} color="#00c2a8" />
        </SlabCard>

        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatChip label="GRADED" value={`${gradedCards}`} sub="cards" />
          <StatChip label="RAW" value={`${rawCards}`} sub="cards" />
          <StatChip label="NET" value={`${isPos ? '+' : ''}$${gain}`} pos={isPos} />
        </View>

        {/* Recent grades */}
        {recentGrades.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: t.ink }]}>Recent Grades</Text>
              <Pressable onPress={() => router.push('/(tabs)/collection')} hitSlop={8}>
                <Text style={[styles.seeAll, { color: t.accent }]}>See all</Text>
              </Pressable>
            </View>
            {recentGrades.map((card) => (
              <Pressable
                key={card.id}
                onPress={() => router.push({ pathname: '/detail', params: { id: card.id } })}
                style={[styles.cardRow, { backgroundColor: t.surface, borderColor: t.line }]}
              >
                {/* Mini card thumb */}
                <View style={[styles.miniThumb, { backgroundColor: t.surface2, borderColor: t.line2 }]}>
                  <Text style={[styles.miniGrade, { color: t.accent }]}>{card.grade.replace('PSA ', '')}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardName, { color: t.ink }]} numberOfLines={1}>{card.name}</Text>
                  <Text style={[styles.cardMeta, { color: t.muted }]} numberOfLines={1}>
                    {card.set} · {card.grade}
                  </Text>
                </View>
                <Text style={[styles.cardValue, { color: t.ink }]}>${card.value}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {collection.length === 0 && (
          <View style={styles.emptyWrap}>
            <Text style={[styles.emptyTitle, { color: t.ink }]}>Start grading cards</Text>
            <Text style={[styles.emptyBody, { color: t.muted2 }]}>
              Tap the camera button below to scan your first card.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingBottom: 14, paddingTop: 4 },
  greeting: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 13 },
  titleText: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 24, letterSpacing: -0.4 },
  headerIcons: { flexDirection: 'row', gap: 8, paddingTop: 4 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  glowCircle: { position: 'absolute', right: -20, top: -20, width: 110, height: 110, borderRadius: 55, backgroundColor: 'rgba(0,194,168,0.38)' },
  portfolioLabel: { fontFamily: 'DMMono_400Regular', fontSize: 10, letterSpacing: 1.2, color: '#7fe9d8', marginBottom: 4 },
  portfolioValue: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 36, color: '#fff', letterSpacing: -1 },
  portfolioDeltaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  deltaBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  deltaBadgeText: { fontFamily: 'DMMono_500Medium', fontSize: 12 },
  portfolioSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 12, color: '#9fb0aa' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  statChip: { flex: 1, borderRadius: 16, padding: 14, borderWidth: 1 },
  statLabel: { fontFamily: 'DMMono_400Regular', fontSize: 9, letterSpacing: 0.8, marginBottom: 4 },
  statValue: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20 },
  statSub: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 11 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 15 },
  seeAll: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 13 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 12, marginBottom: 8 },
  miniThumb: { width: 42, height: 58, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  miniGrade: { fontFamily: 'BricolageGrotesque_800ExtraBold', fontSize: 18 },
  cardName: { fontFamily: 'HankenGrotesk_600SemiBold', fontSize: 14 },
  cardMeta: { fontFamily: 'DMMono_400Regular', fontSize: 11, marginTop: 2 },
  cardValue: { fontFamily: 'HankenGrotesk_700Bold', fontSize: 15 },
  emptyWrap: { paddingTop: 40, alignItems: 'center' },
  emptyTitle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 20, marginBottom: 10 },
  emptyBody: { fontFamily: 'HankenGrotesk_400Regular', fontSize: 14, lineHeight: 21, textAlign: 'center' },
  pos: {},
  neg: {},
});
